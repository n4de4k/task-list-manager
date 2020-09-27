### CLI
1. Enter cli directory: `cd cli`
2. Install: `npm i`
3. Install package globally: `npm i -g .`
4. Run `tasklist -h`

All command can be found in help. Here some functionality:
`tasklist -c "Cooking dinner" -t "routine,work"`
Creating new tasklist `"Cooking dinner"` with tag `[routine, work]`

`tasklist -l`
Showing all task list

`tasklist -u`
Update task by id, you will be prompted with some interaction to choose task

`tasklist -d`
Delete task by id, you will be prompted with some interaction to choose task

`tasklist -s`
Sync local db with remote dn

To test, run: `npm run test`


### WEB
1. Build: `npm run build`
2. Serve build folder, using nginx or using npm package `serve`
3. Install serve with `npm i -g serve`
4. Run: `serve -s build/`
5. Access: `localhost:5000`

Or you can run development mode:
1. Run: `npm start`
2. Access `localhost:3000`