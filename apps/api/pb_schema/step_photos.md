# Collection: step_photos

GPS-verified on-site photos for each installation stage. Created by the field employee
via `GeoCameraCapture.jsx`. Immutable once created (proof cannot be swapped).

## Fields

| Field | Type | Notes |
|---|---|---|
| `project` | relation → projects | which site |
| `step_no` | number | 1–12 |
| `photo` | file (single) | live-captured WebP (~150 KB) |
| `lat` | number | capture latitude |
| `lng` | number | capture longitude |
| `accuracy_m` | number | GPS accuracy (m) |
| `device_time` | date | client clock at capture |
| `distance_m` | number | distance from the registered site |
| `within_geofence` | bool | pass/fail (≤ 150 m) |
| `uploaded_by` | relation → users | `@request.auth.id` |
| `created` | auto | **server** timestamp (tamper-proof) |

## API rules

```
List/View : @request.auth.id != "" && (
              project.vendor_id   = @request.auth.vendor_id ||
              project.subvendor_id = @request.auth.subvendor_id ||
              project.k_no        = @request.auth.k_no
            )
Create     : @request.auth.id != "" && project.assigned_to = @request.auth.id
Update     : ""   // immutable — no one edits a submitted photo
Delete     : ""   // immutable
```

> The vendor sees its sub-vendors' rows; a sub-vendor never sees the vendor's.
> Customers see only rows for their own `k_no`.

## Related collections (to build the same way)

`vendors`, `subvendors`, `profiles` (users + role), `customers`, `projects`,
`project_steps`, `complaints`, `approvals`. See the blueprint for full fields.
