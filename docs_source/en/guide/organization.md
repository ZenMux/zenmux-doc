---
head:
  - - meta
    - name: description
      content: Use ZenMux organizations to manage members, API keys, usage, and billing
  - - meta
    - name: keywords
      content: ZenMux, Organization, Team, Members, API Key, Usage, Billing
---

# Organizations

ZenMux organizations provide teams with a separate Pay As You Go workspace. Members can use Studio and APIs with a shared organization balance, while administrators centrally manage members, API keys, usage, limits, and billing.

::: info Personal and organization accounts are separate
An organization has its own balance, API keys, request logs, and usage data. After switching accounts, confirm the active account before topping up, creating an API key, or making requests.
:::

## Feature overview

| Feature | Description |
| --- | --- |
| Account switching | Switch between your personal account and organizations you have joined |
| Member collaboration | Invite members by email and assign the Admin or Member role |
| API key management | Members create and use their own organization API keys; admins can view all keys in the organization |
| Member limits | Set total, daily, weekly, and monthly Credits limits |
| Usage analysis | Review request logs, usage, and cost by member |
| Centralized billing | Pay for team usage with a separate organization Pay As You Go balance |

Organizations currently use **Pay As You Go**. They do not inherit Builder Plan subscriptions or allowances from personal accounts. For top-up and billing details, see [Pay As You Go](/guide/pay-as-you-go).

## Create an organization

![Create an organization](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/Ks3i10S/01-settings-organization-entry.png)

1. Sign in to ZenMux and open [Manage > Settings](https://zenmux.ai/platform/settings).
2. Find **Organization** in the **Account** section and click **Create**.
3. Enter an organization name and optionally upload a logo.
4. Click **Create**. ZenMux automatically switches to the new organization.

![Create organization dialog](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/OQm69Fz/02-create-organization-dialog.png)

Organization names can contain up to 64 characters. A logo must be an image no larger than 10 MB; a 1:1 image is recommended.

::: tip Current default limits
Each user can create up to **1 organization** and join up to **5 organizations**. ZenMux may adjust the effective limits for an account, so refer to the message shown in the console.
:::

If Organization is not shown in Settings, the feature may not yet be available for your account. If the button is disabled, check whether you have reached the organization creation or membership limit.

## Switch accounts

![Switch between personal and organization accounts](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/iXcNTHY/03-account-switcher-raw.png)

1. Click your avatar in the upper-right corner.
2. Click or hover over **Personal** / **Organization** below the active account name.
3. Select a personal account or organization from the account list.

After switching, the page uses the balance, API keys, logs, and usage data of the selected account. Pages restricted to personal accounts or organization admins may redirect to an accessible page.

## Invite and manage members

Only organization admins can open [Manage > Members](https://zenmux.ai/platform/members) and manage members.

### Invite members

![Organization members](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/P6x5mhF/20260722100720.jpg)
![Organization members 2](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/AmkQfPU/20260722101056.jpg)

1. Switch to the target organization.
2. Open **Manage > Members** and click **Invite**.
3. Enter one or more member email addresses and assign the **Admin** or **Member** role.
4. Send the invitations.

![Invite organization members](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/d7SouON/20260722101143.jpg)

An invitee must open and accept the link while signed in to a ZenMux account with the same email address. A new user can register with that email first. Invitation links expire after **7 days**.

::: tip Member limit
Each organization can have up to **50 active or pending members**. Invites for existing active members are skipped, and admins can cancel pending invitations.
:::

### Role permissions

| Capability | Admin | Member |
| --- | :---: | :---: |
| Use the organization balance in Studio and APIs | ✓ | ✓ |
| Create and manage personal organization API keys | ✓ | ✓ |
| View personal logs and usage | ✓ | ✓ |
| View all members, logs, usage, and cost | ✓ | — |
| Invite or remove members and change roles | ✓ | — |
| Set member Credits limits | ✓ | — |
| Top up and manage billing and balance alerts | ✓ | — |
| Edit or delete the organization | ✓ | — |

An organization must always have at least one admin. The last admin cannot be demoted, removed, or leave until another member is made an admin.

### Set member limits

Admins can set the following Credits limits for each member on the Members page:

![Set member limits](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/hBmFiFM/20260722101230.jpg)
![Set member limits 2](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/dyCsB2d/20260722101242.jpg)

| Limit | Description |
| --- | --- |
| Total | Maximum cumulative Credits the member can consume |
| Day | Maximum Credits per calendar day |
| Week | Maximum Credits per calendar week |
| Month | Maximum Credits per calendar month |

Leave a field empty for no limit. When a member reaches a period limit, access to organization credits is paused until the next period. A Total limit does not reset automatically and must be adjusted by an admin.

## Use organization API keys

After switching to an organization, API keys created under **Manage > Pay As You Go** or **Manage > Platform API** belong to that organization, and their usage is charged to the organization balance.

![Manage organization API keys](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/Aui9AJy/20260722101421.jpg)
![Manage organization API keys 2](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/I6m4GS3/20260722101521.jpg)

- Members can only view, copy, and manage the API keys they create.
- Admins can view all organization API keys and their creators, but full keys belonging to other members are hidden.
- Admins can filter usage and cost data by member.
- When a member leaves or is removed, API keys created by that member in the organization are disabled immediately.

::: warning Switch accounts before creating a key
Personal and organization data are fully isolated. Before creating an API key, verify that the correct Organization is active in the avatar menu.
:::

## Top-ups, billing, and usage

Organization admins can top up, configure automatic top-ups and balance alerts under **Manage > Pay As You Go**, and maintain billing information under **Manage > Billing**. Members can use organization credits but cannot manage top-ups or billing.

![Organization balance and top-ups](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/e8F1a2V/20260722101654.jpg)

On the Logs, Usage, and Cost pages under Analysis:

- Admins can view organization-wide data and filter by member.
- Members can only view data associated with themselves and their own API keys.

## Edit, leave, or delete an organization

Click your avatar and then the settings icon beside the active organization to open organization management. You can also click **Manage** for Organization under **Manage > Settings > Account**.

![Manage an organization](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/IJrWedE/20260722101751.jpg)

### Edit the organization

Admins can change the organization name and logo. Members can view organization information but cannot edit it.

### Leave the organization

Any member can leave an organization. After leaving:

- ZenMux automatically switches back to the personal account;
- you can no longer access organization data;
- API keys you created in the organization are disabled immediately.

The last admin must appoint another admin before leaving.

### Delete the organization

Only admins can delete an organization. Enter `DELETE` to confirm. If the organization has an outstanding balance, settle the debt first.

![Confirm organization deletion](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/QlpYfmY/20260722103101.jpg)

::: danger Deletion cannot be undone
Deleting an organization immediately disables every API key, removes every member, and forfeits any remaining balance without a refund. Organization history cannot be restored.
:::

## FAQ

### Why can't I accept an invitation?

Confirm that the email of the signed-in account exactly matches the invited email, and check whether the invitation has expired, been canceled, or already been accepted.

### Why are a member's API requests rejected?

Check the organization balance, API key status, and the member's Total, Day, Week, and Month limits. Organization API keys are also disabled when their owner leaves or is removed.

### Why can't a member see Members or Billing?

These pages are available only to organization admins. An admin can change a member's role to Admin on the Members page.
