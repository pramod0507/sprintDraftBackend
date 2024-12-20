const sqlite3 = require('sqlite3').verbose()
const dbName = "sprintDraft.db"

const db = new sqlite3.Database(dbName, (err)=>{
	if (err){
		console.error(err.message)
	}else{
		console.log("connected to database")
		db.run('CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY AUTOINCREMENT, project_id TEXT, zs_project_Id TEXT, project_settings TEXT, qa_hr_key TEXT, dev_hr_key TEXT, qa_user_field TEXT, zs_project_name TEXT, pass_key TEXT, zs_sprint_key TEXT)', 
			(err)=>{
				if(err){
					console.log(err.message)
				}else{
					console.log("Table settings created or exists")
				}
			})


		
		db.run('CREATE TABLE IF NOT EXISTS drafts(id INTEGER PRIMARY KEY AUTOINCREMENT, sprint_id TEXT, project_id TEXT, sprint_settings TEXT, sprint_users TEXT, sprint_tickets TEXT, team TEXT)', 
			(err)=>{
				if(err){
					console.log(err.message)
				}else{
					console.log("Table drafts created or exists")
				}
			})
	}
})

module.exports = db;