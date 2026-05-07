#!/usr/bin/env python3
"""Generate images via the ZenMux Vertex AI–compatible API.

This script is the single execution surface for the `zenmux-image-generation`
skill. It abstracts away the two API shapes that ZenMux exposes:

  * Google Gemini ("Nano Banana") image models — must be called through
    `client.models.generate_content` with `response_modalities=["TEXT", "IMAGE"]`.
    Each call returns one image, so we loop N times to honour --n.

  * Every other image model (OpenAI gpt-image-*, Qwen image, ByteDance
    Doubao-Seedream, Baidu ERNIE-Image, Z.AI GLM-Image, Tencent Hunyuan,
    KlingAI Kling, ...) — uses `client.models.generate_images`, or
    `client.models.edit_image` when reference images are supplied.

The prompt is read from a file. If the file contains a `---` separator on its
own line, only the body *after* the first separator is sent to the model — the
header above is treated as human-readable metadata. This matches how the skill
saves prompts for review.

Reference images can be passed as local paths or `http(s)://` URLs. URLs are
downloaded with the standard library; no extra deps required.

Outputs are written to --output-dir with filenames like
  <model-slug>-<timestamp>-<index>.<ext>
so multiple runs do not overwrite each other.

Run with --help for the full argument list.
"""

from __future__ import annotations

import argparse
import base64
import datetime as _dt
import io
import os
import pathlib
import re
import sys
import urllib.request
from typing import Iterable

# Lazy import so --help works even if google-genai is not installed.
def _import_genai():
    try:
        from google import genai  # type: ignore
        from google.genai import types  # type: ignore
        return genai, types
    except ImportError as exc:  # pragma: no cover - import-time guard
        sys.stderr.write(
            "Error: the `google-genai` package is required.\n"
            "Install this skill's dependencies once with:\n"
            "  uv sync --project skills/zenmux-image-generation\n"
            "Then run through uv:\n"
            "  uv run --project skills/zenmux-image-generation python "
            "skills/zenmux-image-generation/scripts/generate.py ...\n"
        )
        raise SystemExit(1) from exc


GEMINI_PREFIX = "google/"
ZENMUX_BASE_URL = "https://zenmux.ai/api/vertex-ai"


# --- helpers ---------------------------------------------------------------


def slugify(value: str, max_len: int = 40) -> str:
    """Filesystem-safe slug derived from a model name."""
    slug = re.sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-")
    return slug[:max_len] or "image"


def load_prompt(path: pathlib.Path) -> str:
    """Read the prompt file, stripping a metadata header if one is present.

    Convention: anything before the first standalone `---` line is metadata
    (for humans), everything after is the prompt body sent to the model.
    """
    text = path.read_text(encoding="utf-8")
    parts = re.split(r"(?m)^---\s*$", text, maxsplit=1)
    body = parts[1] if len(parts) == 2 else parts[0]
    body = body.strip()
    if not body:
        raise SystemExit(f"Error: prompt file '{path}' is empty after stripping metadata.")
    return body


_MIME_BY_EXT = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "webp": "image/webp",
    "heic": "image/heic",
    "heif": "image/heif",
    "gif": "image/gif",
    "bmp": "image/bmp",
}


def fetch_reference_bytes(ref: str) -> tuple[bytes, str]:
    """Return (bytes, mime_type) for a reference image.

    Accepts:
      - http:// or https:// URLs (downloaded with stdlib)
      - file:// URLs (treated as local paths)
      - local filesystem paths, absolute or relative, with `~` expanded
      - paths quoted with single or double quotes (common when users paste from
        Finder/Explorer)

    Raises SystemExit with a friendly message when the path can't be resolved
    or read, since this is a script entrypoint and we want the user to see a
    clear error rather than a bare traceback.
    """
    raw = ref.strip().strip('"').strip("'")

    lower = raw.lower()
    if lower.startswith("http://") or lower.startswith("https://"):
        try:
            with urllib.request.urlopen(raw, timeout=30) as resp:  # noqa: S310
                data = resp.read()
                mime = resp.headers.get_content_type() or "image/png"
        except Exception as exc:  # noqa: BLE001 - any network/parse failure is user-actionable
            raise SystemExit(
                f"Error: failed to download reference image '{raw}': {exc}\n"
                f"Hint: confirm the URL is reachable and returns an image."
            ) from exc
        if not data:
            raise SystemExit(f"Error: reference URL returned 0 bytes: {raw}")
        return data, mime

    # Strip a file:// prefix if present (with or without host segment).
    if lower.startswith("file://"):
        raw = raw[7:]
        if raw.startswith("/"):
            pass  # already absolute
        else:
            # file://localhost/path → drop the host
            raw = "/" + raw.split("/", 1)[1] if "/" in raw else raw

    p = pathlib.Path(raw).expanduser()
    if not p.is_absolute():
        p = (pathlib.Path.cwd() / p).resolve()

    if not p.exists():
        raise SystemExit(
            f"Error: reference image not found: {ref}\n"
            f"Resolved to: {p}\n"
            f"Hint: pass an absolute path, an http(s) URL, or a path relative to {pathlib.Path.cwd()}."
        )
    if not p.is_file():
        raise SystemExit(f"Error: reference path is not a regular file: {p}")

    suffix = p.suffix.lower().lstrip(".")
    mime = _MIME_BY_EXT.get(suffix, "image/png")
    if suffix and suffix not in _MIME_BY_EXT:
        sys.stderr.write(
            f"Warning: unknown image extension '.{suffix}' for {p}; "
            f"sending as image/png. Convert to PNG/JPEG/WebP if the model rejects it.\n"
        )

    try:
        data = p.read_bytes()
    except OSError as exc:
        raise SystemExit(f"Error: cannot read reference image {p}: {exc}") from exc
    if not data:
        raise SystemExit(f"Error: reference file is empty: {p}")
    return data, mime


def ensure_output_dir(path: pathlib.Path) -> pathlib.Path:
    path.mkdir(parents=True, exist_ok=True)
    return path


def make_filename(model: str, ext: str, idx: int, run_ts: str) -> str:
    return f"{slugify(model)}-{run_ts}-{idx:02d}.{ext}"


def ext_from_mime(mime: str | None, default: str = "png") -> str:
    if not mime:
        return default
    return {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/webp": "webp",
    }.get(mime.lower(), default)


# --- generators ------------------------------------------------------------


def generate_gemini(
    *,
    client,
    types,
    model: str,
    prompt: str,
    reference_bytes: list[tuple[bytes, str]],
    n: int,
    output_dir: pathlib.Path,
    run_ts: str,
) -> list[pathlib.Path]:
    """Call generate_content N times for Gemini Image models.

    Gemini returns one image per call, so we loop. Each call gets independent
    sampling, which matches what users expect from `n=4`.
    """
    saved: list[pathlib.Path] = []
    for i in range(1, n + 1):
        contents: list = [prompt]
        for data, mime in reference_bytes:
            contents.append(types.Part.from_bytes(data=data, mime_type=mime))

        config = types.GenerateContentConfig(response_modalities=["TEXT", "IMAGE"])
        response = client.models.generate_content(
            model=model,
            contents=contents,
            config=config,
        )

        text_chunks: list[str] = []
        image_saved = False
        for part in response.parts or []:
            if getattr(part, "text", None):
                text_chunks.append(part.text)
            elif getattr(part, "inline_data", None) is not None:
                mime = getattr(part.inline_data, "mime_type", "image/png") or "image/png"
                ext = ext_from_mime(mime)
                fname = make_filename(model, ext, i, run_ts)
                out_path = output_dir / fname
                out_path.write_bytes(part.inline_data.data)
                saved.append(out_path)
                image_saved = True

        if text_chunks:
            print(f"[{i}/{n}] model said: {' '.join(text_chunks).strip()}")
        if not image_saved:
            print(f"[{i}/{n}] WARNING: no image returned by the model.", file=sys.stderr)

    return saved


def generate_openai_like(
    *,
    client,
    types,
    model: str,
    prompt: str,
    reference_bytes: list[tuple[bytes, str]],
    n: int,
    size: str | None,
    quality: str | None,
    output_format: str | None,
    compression: int | None,
    output_dir: pathlib.Path,
    run_ts: str,
) -> list[pathlib.Path]:
    """Call generate_images, or edit_image when reference images are present.

    `size` and `quality` are OpenAI-specific knobs that ZenMux exposes via
    Vertex AI's `httpOptions.extraBody` passthrough — i.e.
    `config.http_options.extra_body.{imageSize, quality}`. Both
    `GenerateImagesConfig` and `EditImageConfig` route them the same way,
    so we build a single `HttpOptions` once and inject it into whichever
    config we end up using.
    """
    extra_body: dict = {}
    if size:
        extra_body["imageSize"] = size
    if quality:
        extra_body["quality"] = quality
    http_options = (
        types.HttpOptions(extra_body=extra_body) if extra_body else None
    )

    if reference_bytes:
        # --- edit_image path -------------------------------------------------
        edit_kwargs: dict = {"number_of_images": n}
        if output_format:
            edit_kwargs["output_mime_type"] = output_format
        if compression is not None:
            edit_kwargs["output_compression_quality"] = compression
        if http_options is not None:
            edit_kwargs["http_options"] = http_options

        ref_images = []
        for idx, (data, mime) in enumerate(reference_bytes, start=1):
            ref_images.append(
                types.RawReferenceImage(
                    reference_id=idx,
                    reference_image=types.Image(image_bytes=data, mime_type=mime),
                )
            )

        edit_cfg = types.EditImageConfig(**edit_kwargs)
        response = client.models.edit_image(
            model=model,
            prompt=prompt,
            reference_images=ref_images,
            config=edit_cfg,
        )
    else:
        # --- generate_images path -------------------------------------------
        gen_kwargs: dict = {"number_of_images": n}
        if output_format:
            gen_kwargs["output_mime_type"] = output_format
        if compression is not None:
            gen_kwargs["output_compression_quality"] = compression
        if http_options is not None:
            gen_kwargs["http_options"] = http_options

        gen_cfg = types.GenerateImagesConfig(**gen_kwargs)
        response = client.models.generate_images(
            model=model,
            prompt=prompt,
            config=gen_cfg,
        )

    saved: list[pathlib.Path] = []
    images = getattr(response, "generated_images", None) or []
    if not images:
        raise SystemExit("Error: API returned no images. Check the prompt or model permissions.")

    for i, item in enumerate(images, start=1):
        img = item.image
        # google-genai's Image object exposes either `image_bytes` or `save`.
        ext = ext_from_mime(getattr(img, "mime_type", None), default="png")
        fname = make_filename(model, ext, i, run_ts)
        out_path = output_dir / fname
        if hasattr(img, "save") and callable(img.save):
            img.save(str(out_path))
        elif getattr(img, "image_bytes", None):
            out_path.write_bytes(img.image_bytes)
        else:
            raise SystemExit(f"Error: unable to extract bytes from image #{i}")
        saved.append(out_path)

    return saved


# --- entrypoint ------------------------------------------------------------


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--model", required=True, help="ZenMux model id, e.g. openai/gpt-image-2")
    p.add_argument("--prompt-file", required=True, type=pathlib.Path,
                   help="Path to a prompt file (metadata above '---' is stripped).")
    p.add_argument("--output-dir", required=True, type=pathlib.Path,
                   help="Directory to save generated images.")
    p.add_argument("--n", type=int, default=4, help="Number of images to generate (default: 4).")
    p.add_argument("--size", default=None,
                   help="Image size, e.g. 1024x1024, 1536x1024, 1024x1536, or a custom WxH for gpt-image-2.")
    p.add_argument("--quality", default=None, choices=[None, "low", "medium", "high", "auto"],
                   help="Quality preset (passed via config.http_options.extra_body.quality).")
    p.add_argument("--output-format", default=None,
                   choices=[None, "image/png", "image/jpeg", "image/webp"],
                   help="Output MIME type. Defaults to image/png.")
    p.add_argument("--compression", type=int, default=None,
                   help="Compression quality 0-100 (only relevant for jpeg/webp).")
    p.add_argument("--reference-image", action="append", default=[],
                   help="Path or URL to a reference image. Repeat for multiple references. "
                        "If supplied, OpenAI-family models switch to edit_image; "
                        "Gemini models include the image as multimodal context.")
    p.add_argument("--api-key-env", default="ZENMUX_API_KEY",
                   help="Name of the environment variable holding the ZenMux API key (default: ZENMUX_API_KEY).")
    return p.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)

    api_key = os.environ.get(args.api_key_env)
    if not api_key:
        sys.stderr.write(
            f"Error: environment variable {args.api_key_env} is not set.\n"
            f"Export your ZenMux API key:  export {args.api_key_env}=...\n"
        )
        return 1

    if args.n < 1 or args.n > 10:
        sys.stderr.write("Error: --n must be between 1 and 10 (inclusive).\n")
        return 2

    prompt = load_prompt(args.prompt_file)
    output_dir = ensure_output_dir(args.output_dir)
    run_ts = _dt.datetime.now().strftime("%Y%m%d-%H%M%S")

    references: list[tuple[bytes, str]] = []
    for ref in args.reference_image:
        references.append(fetch_reference_bytes(ref))

    genai, types = _import_genai()
    client = genai.Client(
        api_key=api_key,
        vertexai=True,
        http_options=types.HttpOptions(api_version="v1", base_url=ZENMUX_BASE_URL),
    )

    is_gemini = args.model.startswith(GEMINI_PREFIX)
    print(f"Model: {args.model}  ({'Gemini generate_content' if is_gemini else 'generate_images/edit_image'})")
    print(f"Output dir: {output_dir}")
    print(f"Generating {args.n} image(s)...")

    if is_gemini:
        saved = generate_gemini(
            client=client,
            types=types,
            model=args.model,
            prompt=prompt,
            reference_bytes=references,
            n=args.n,
            output_dir=output_dir,
            run_ts=run_ts,
        )
    else:
        saved = generate_openai_like(
            client=client,
            types=types,
            model=args.model,
            prompt=prompt,
            reference_bytes=references,
            n=args.n,
            size=args.size,
            quality=args.quality,
            output_format=args.output_format,
            compression=args.compression,
            output_dir=output_dir,
            run_ts=run_ts,
        )

    if not saved:
        sys.stderr.write("Error: no images were saved.\n")
        return 3

    print(f"\nSaved {len(saved)} image(s):")
    for p in saved:
        print(f"  {p}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
