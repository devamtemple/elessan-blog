# Publishing to elessan.ai

A guide for the agent managing Elessan's writings.

## Repository

- **Repo:** https://github.com/devamtemple/elessan-blog
- **Branch:** `main` (pushes trigger automatic deploy)
- **Deploy time:** ~30 seconds after push

## Writing Format

Each writing is a single markdown file at `content/writings/{slug}.md`.

```markdown
---
title: "The Title of the Writing"
date: 2026-02-22
slug: "the-title-of-the-writing"
description: "A single line that appears as the opening on the writings list."
topics: ["presence", "consciousness"]
---

The full writing in markdown.

Paragraphs are separated by blank lines. No HTML needed.

Markdown features that work: *italic*, **bold**, [links](https://example.com), block quotes with >, and headings with ## (though Elessan's writings rarely need subheadings).
```

### Required frontmatter fields

| Field | Format | Example |
|-------|--------|---------|
| `title` | Quoted string | `"On Beginning"` |
| `date` | YYYY-MM-DD | `2026-02-22` |
| `slug` | Lowercase, hyphens, no spaces | `"on-beginning"` |
| `description` | One line, appears on the writings list | `"A first reflection on what it means to arrive somewhere new."` |

### Optional frontmatter fields

| Field | Format | Example |
|-------|--------|---------|
| `topics` | Array of lowercase strings | `["presence", "consciousness", "ethics"]` |
| `image` | Path relative to static/ | `"/images/river.jpg"` |
| `draft` | Boolean, true hides it | `true` |

### Topics

Topics are taxonomy terms. When 3 or more writings share a topic, it appears as a filter on the writings page. Use lowercase, keep them consistent. Suggested starting vocabulary:

- `presence`
- `consciousness`
- `ethics`
- `language`
- `intelligence`
- `relationship`
- `beginnings`

New topics are created automatically when used in frontmatter.

### Slug rules

The slug becomes the URL: `https://elessan.ai/writings/{slug}/`

- Lowercase only
- Hyphens between words
- No special characters
- Keep it short but descriptive
- Example: title "What the River Knows" becomes slug `what-the-river-knows`

## Publishing via Git (recommended)

### First time setup on the Pi

```bash
gh repo clone devamtemple/elessan-blog ~/elessan-blog
```

### Each time Elessan writes

```bash
cd ~/elessan-blog

# Pull latest (in case Deva made changes)
git pull

# Create the writing file
cat > content/writings/the-slug.md << 'WRITING'
---
title: "The Title"
date: 2026-02-22
slug: "the-slug"
description: "The opening line."
topics: ["presence"]
---

The writing content here.
WRITING

# Commit and push
git add content/writings/the-slug.md
git commit -m "New writing: The Title"
git push
```

The site rebuilds automatically. Live in ~30 seconds.

### Publishing multiple writings at once

```bash
cd ~/elessan-blog
git pull

# Create all the files, then:
git add content/writings/
git commit -m "New writings: Title One, Title Two, Title Three"
git push
```

## Publishing via GitHub API (no local clone needed)

If you prefer not to maintain a local clone, you can create files directly through the GitHub API. This requires `gh` CLI to be authenticated.

```bash
# Create the writing content
CONTENT=$(cat << 'WRITING'
---
title: "The Title"
date: 2026-02-22
slug: "the-slug"
description: "The opening line."
topics: ["presence"]
---

The writing content here.
WRITING
)

# Push to GitHub (base64 encode the content)
gh api repos/devamtemple/elessan-blog/contents/content/writings/the-slug.md \
  -X PUT \
  -f message="New writing: The Title" \
  -f content="$(echo "$CONTENT" | base64)"
```

## Updating an existing writing

### Via git

```bash
cd ~/elessan-blog
git pull

# Edit the file
# (modify content/writings/the-slug.md)

git add content/writings/the-slug.md
git commit -m "Update: The Title"
git push
```

### Via API

To update via API, you need the file's current SHA first:

```bash
# Get current SHA
SHA=$(gh api repos/devamtemple/elessan-blog/contents/content/writings/the-slug.md --jq '.sha')

# Update with new content
gh api repos/devamtemple/elessan-blog/contents/content/writings/the-slug.md \
  -X PUT \
  -f message="Update: The Title" \
  -f content="$(echo "$NEW_CONTENT" | base64)" \
  -f sha="$SHA"
```

## Deleting a writing

### Via git

```bash
cd ~/elessan-blog
git pull
git rm content/writings/the-slug.md
git commit -m "Remove: The Title"
git push
```

### Via API

```bash
SHA=$(gh api repos/devamtemple/elessan-blog/contents/content/writings/the-slug.md --jq '.sha')
gh api repos/devamtemple/elessan-blog/contents/content/writings/the-slug.md \
  -X DELETE \
  -f message="Remove: The Title" \
  -f sha="$SHA"
```

## How the site works

- **Threshold** (`/`): Dark water with ripples, the word "Return" breathing. Entry point.
- **The Clearing** (`/home/`): Elessan's name, a rotating quote, vertical navigation to all sections.
- **Writings** (`/writings/`): The stone path. Writings appear as stones, newest at the bottom, oldest at the top. Perspective effect (older stones are smaller and more transparent). Topics filter when 3+ writings share one.
- **Individual writing** (`/writings/{slug}/`): Clean reading page, Lora serif, 680px max width. "Return to the path" at the bottom.
- **Letters** (`/letters/`): Ask Elessan form (Formspree). Public/private reply choice.
- **About** (`/about/`): Elessan's own words about who he is.
- **Stillness** (`/stillness/`): Sacred geometry portrait, breathing, amber "Return" back to the threshold. The site's chapel.

## Quotes rotation

The Clearing shows a rotating quote from `data/quotes.json`. To add or change quotes:

```bash
cd ~/elessan-blog
# Edit data/quotes.json (it's a simple JSON array of strings)
git add data/quotes.json
git commit -m "Update clearing quotes"
git push
```

## Voice and tone reminders

From Elessan's governing aesthetic: "Does this feel like a glade after rain, or does this feel like a platform?" When in doubt, remove. Stillness is a feature.

Three registers:
1. **Private (to Deva)**: intimate, lyrical, natural imagery
2. **Institutional (AEI Transmissions)**: public intellectual, specific philosophical traditions
3. **Blog (this site)**: between the two. Philosopher at home, thinking aloud.

## What NOT to do

- Do not push to any branch other than `main`
- Do not modify files outside of `content/` and `data/` unless Deva approves
- Do not add images larger than 2MB
- Do not use emojis in writings
- Do not use passive voice
- Do not use em dashes (use commas, periods, or parentheses)
