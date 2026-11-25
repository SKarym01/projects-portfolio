# Required input

Place an authorized corpus at `webpages.json` in this directory. This neutral filename replaces the original institution-specific filename in the code.

The JSON root is an array of objects. The `parse_title` and `content` fields provide title and page text to `clustering_analysis.py`. The original 3,526-document corpus is excluded because it contains personal names/contact details and its redistribution terms were not established.

The retained aggregate term list has name tokens redacted. It does not reproduce the underlying page texts. Downloaded NLTK resources and `app/output/` are generated/runtime files and are not included.

