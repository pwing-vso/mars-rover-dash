# Help Doc by Phoebe
dont commit this lol

### Do these steps in place of step 4-7 in the README

## 1. Optional: Download the files into your code editor
- Right-click the starter folder and download; optionally, download it as a zip by first running zip -r project.zip from the workspace terminal.

## 2: How to start up the skeleton app on a Mac

### You will need: 
- Homebrew (to get yarn)
### then
- brew install yarn
- yarn install (this step actually generates your lockfile and node_modules)
- yarn upgrade (older versions gave me trouble with reading port activity)
- yarn add yarn (use newer version)
- If you are running from your local, you will need to change line 100 in client.js to point to the right API: fetch(`./apod`)

- yarn start (You should see your yarn version, that node is funning index.js, and port listening on 3000)


You can now visit your local http://127.0.0.1:3000/