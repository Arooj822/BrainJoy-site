# BrainJoy early-access list: gate before ANY send

This note is internal project documentation. It holds no personal addresses and is not part of the published site.

Before any newsletter or email is sent from the early-access list:

1. The site owner must approve that specific send and its wording in her own words.
2. Recipients are only Buttondown subscribers whose status is Regular (confirmed) AND whose metadata `consent_v1` is `True`. Filter Subscribers by metadata. Exclude any record where it is missing or False.
3. The Buttondown "Mailing address" field is empty. Settle it with the owner first. No public home address is approved.
4. Buttondown's confirmation email has no unsubscribe or privacy link on the free plan. Until a newsletter footer is checked, the portal pointer under the forms and the privacy page are the unsubscribe route (https://buttondown.com/portal).
5. The browser-side "required" attribute on the consent checkbox is not proven to be enforced by Buttondown's server. The pre-send filter in item 2 is the control.
6. Buttondown emails the account owner a notice for each signup and unsubscribe.
7. Consent wording is "I agree to receive BrainJoy early-access and launch emails." and is tied to the key `consent_v1`. Any wording change needs a new key (`consent_v2`).
8. Hide, never delete: unsubscribed records stay. Do not enable auto-cleanup.
