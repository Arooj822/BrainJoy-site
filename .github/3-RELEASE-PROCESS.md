# BrainJoy release process (no secrets here)

How the live site is built: workflow `.github/workflows/brainjoy-release-bx.yml` (manual run only).
1. It downloads the base workflow `brainjoy-allowlisted-pages.yml`, checks its SHA-256, runs its build step.
2. It overlays files listed in the `OVERLAY` dict (file name -> SHA-256). File contents come from `BLOBS`
   (embedded, lzma+base64 JSON) and from each part in `PARTS`, stored in `.github/release-data/`. Later parts override earlier ones.
3. It checks the live config and that no private or archive files are present, then publishes to GitHub Pages.

To add a release (example: release 239):
1. Copy the current workflow. Build a new part: JSON {file name: new text}, lzma-compressed, base64. Add each file's new SHA-256 to `OVERLAY`, append the part name to `PARTS`.
2. Upload the part to `.github/release-data/`. The GitHub web uploader prefixes names ("1-", "2-"); use the final stored name in `PARTS`.
3. Rename the current active workflow to `brainjoy-release-bxNNN-preserved.txt` (old versions are kept, never deleted).
4. Upload the new workflow (the uploader adds a prefix, so rename it to `brainjoy-release-bx.yml` afterwards).
5. Compare the repo file with your local SHA-256, run the workflow from the Actions page, then check the live files' hashes and screenshots at 390 and 1200 px.
Rules: hide, never delete; no spend; no live database, signup, child-data or payment changes without the owner's specific approval.

History: 239 (Nov 25 2026) added canonical tags to 12 lab/post pages (part `1-1-bx239.txt`). 238 Question Bank settings, 237 CSV import review.
History 240-253 (Nov 25 2026): 240-242 earlier lab and library updates (see the commit history for detail). 243 projectile lab QA fixes. 244-245 orbit lab upgrade, then a science correction (apocentre and pericentre from v^2/(2-v^2), escape speed uses sqrt 2). 246-247 orbit lab labels and truncated-orbit wording. 248 starter-quizzes.html (6 quizzes, 48 questions). 249 K-12 Math filter fix for the Maths quiz card. 250 sorting-lab.html and computing-quizzes.html. 251 breakeven-lab.html. 252 source-analysis.html, Bitesize-based quiz wording fix, break-even edge cases. 253 colour-lab.html and break-even zero-fixed-cost wording. Each release added its part file to release-data and kept the previous workflow as `brainjoy-release-bxNNN-preserved.txt`.
