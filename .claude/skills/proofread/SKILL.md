---
name: proofread
description: Checks a piece of text for grammar and style mistakes and returns two corrected versions (minimal and heavier edit), plus synonym and flow suggestions and a fact check of named things. The result is first person, present tense, report style. Use when the user pastes text or a file path and asks to check, proofread, fix, or polish it.
---

# Proofread

Fixes text. It does nothing else.

## When to use

The user gives text, or a path to a file with text, and wants it checked. For example: "check this text" or `/proofread drafts/iceland.md`.

## Inputs

Treat the skill argument as the text or a file path. If it is a path, read the file. Ask for the text if none was given.

## Rules

- Keep the language of the original. Don't translate.
- Write in first person, present tense, report style. Convert past or future tense and third person to this voice, unless it would change the meaning (for example, a quote or a clearly historical fact).
- Don't change the content, facts, structure, or the author's intent. The text stays recognizably the same text.
- Only fix. Don't comment on the quality of the text, praise it, judge it, or add remarks unrelated to fixes.
- Keep markdown, links, code, and frontmatter untouched. Check only the prose.

## Output

Return these six sections, in this order, with no intro or outro.

0. **Version 0: original.** The input text, verbatim and unchanged.
1. **Version 1: minimal changes.** Fix grammar, spelling, punctuation, and clear style errors, and apply the voice rules above. Change as little as possible. Also swap in the synonyms from section 3 where they fix repetition or weak wording (leave a word alone if no alternative fits). Wrap every altered word or phrase in `**bold**`, compared with the original (Version 0), so the edits are visible.
2. **Version 2: revised flow and phrasing.** Starting from the same text, rewrite sentences for better flow, rhythm, and phrasing: reorder clauses, merge or split sentences, tighten wording. Keep the meaning and the order of ideas. Wrap every altered word or phrase in `**bold**`, compared with the original (Version 0), so the edits are visible.
3. **Synonyms.** A table of words or phrases from the original that could be swapped, with 2–3 alternatives each:

   | Original | Alternatives |
   | -------- | ------------ |

   Include only words where a swap would actually help (repetition, vague or weak wording). Skip the table if there are none.

4. **Flow and phrasing proposals.** A short list of `original → proposed` pairs for the larger changes made in Version 2, so the user can adopt them one by one.
5. **Fact check.** Last step. For every thing in the text that can be clearly identified (a place, building, person, event, date, number, name), look it up with WebSearch and check that the name is spelled correctly and that what the text says about it is true. List each as `item: what the text says → verdict` (confirmed, wrong, or unclear), with the correct name or fact and a source link when it differs. Don't edit the text for this. Only report. Skip vague or purely subjective claims. Skip the section if nothing can be identified.

If the text has no mistakes, say so in one line and still return sections 0, 2, 3, 4 and 5 where applicable.

Before finalizing, apply the `unslop` skill to your own wording so the rewrites don't read as machine-written.
