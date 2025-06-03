# Note: This plugin is work in progress

# About

This plugin allows creation of an Obsidian command that can open or create a new file that matches the specified pattern. It can also populate the new file with a given template.

For example, I use it to populate a weekly grocery shopping list inside my weekly notes folder.

# Todo

- [x] Proof of concept note creator with hardcoded file paths
- [x] Hook up configuration
- [x] Convert settings panel to React
- [x] Add config validations
  - [x] That settings > file name ends with MD
  - [x] That new command that was added has been configured
  - [x] That template file has .md extension
  - [x] Apply same validations to configuration imported from file
- [x] Make configuration responsive
- [ ] Move processPattern method from main.ts
- [ ] Add test for importing config from file
- [ ] Add test for exporting config to file

# Dev Notes

I did this project using Bun, because it simplifies the typescript setup comparing to node + typescript, or ts-node. It doesn't even need a tsconfig.json.
