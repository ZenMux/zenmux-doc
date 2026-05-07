Image Streaming
Stream image generation and editing in real time with server-sent events. Learn more about image streaming.

Image generation streaming events

image_generation.partial_image
Emitted when a partial image is available during image generation streaming.

b64_json: string
Base64-encoded partial image data, suitable for rendering as an image.

background: "transparent" or "opaque" or "auto"
The background setting for the requested image.

One of the following:
"transparent"
"opaque"
"auto"
created_at: number
The Unix timestamp when the event was created.

formatunixtime
output_format: "png" or "webp" or "jpeg"
The output format for the requested image.

One of the following:
"png"
"webp"
"jpeg"
partial_image_index: number
0-based index for the partial image (streaming).

quality: "low" or "medium" or "high" or "auto"
The quality setting for the requested image.

One of the following:
"low"
"medium"
"high"
"auto"
size: "1024x1024" or "1024x1536" or "1536x1024" or "auto"
The size of the requested image.

One of the following:
"1024x1024"
"1024x1536"
"1536x1024"
"auto"
type: "image_generation.partial_image"
The type of the event. Always image_generation.partial_image.

image_generation.partial_image

{
  "type": "image_generation.partial_image",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
  "partial_image_index": 0
}
image_generation.completed
Emitted when image generation has completed and the final image is available.

b64_json: string
Base64-encoded image data, suitable for rendering as an image.

background: "transparent" or "opaque" or "auto"
The background setting for the generated image.

One of the following:
"transparent"
"opaque"
"auto"
created_at: number
The Unix timestamp when the event was created.

formatunixtime
output_format: "png" or "webp" or "jpeg"
The output format for the generated image.

One of the following:
"png"
"webp"
"jpeg"
quality: "low" or "medium" or "high" or "auto"
The quality setting for the generated image.

One of the following:
"low"
"medium"
"high"
"auto"
size: "1024x1024" or "1024x1536" or "1536x1024" or "auto"
The size of the generated image.

One of the following:
"1024x1024"
"1024x1536"
"1536x1024"
"auto"
type: "image_generation.completed"
The type of the event. Always image_generation.completed.

usage: object
For the GPT image models only, the token usage information for the image generation.

input_tokens: number
The number of tokens (images and text) in the input prompt.

input_tokens_details: object
The input tokens detailed information for the image generation.

image_tokens: number
The number of image tokens in the input prompt.

text_tokens: number
The number of text tokens in the input prompt.

output_tokens: number
The number of image tokens in the output image.

total_tokens: number
The total number of tokens (images and text) used for the image generation.

image_generation.completed

{
  "type": "image_generation.completed",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
  "usage": {
    "total_tokens": 100,
    "input_tokens": 50,
    "output_tokens": 50,
    "input_tokens_details": {
      "text_tokens": 10,
      "image_tokens": 40
    }
  }
}