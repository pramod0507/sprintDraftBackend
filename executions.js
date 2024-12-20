const db = require('./database')




//create new Sprint
const createSprint = (sprintId, projectId, sprintSettings, sprintUsers, sprintTickets,team, callback)=>{

	const sql = `INSERT INTO drafts (sprint_id, project_id, sprint_settings, sprint_users, sprint_tickets, team) values (?,?,?,?,?,?)`
	db.run(sql,[sprintId, projectId, sprintSettings, sprintUsers, sprintTickets, team],(err)=>{
		callback(err, {id: this.lastID})
	})

}

//get sprint 
const getSprint = (sprintId, projectId, team,callback)=>{
	const sql = `SELECT DISTINCT * FROM 'drafts' where sprint_id = '${sprintId}' and project_id = '${projectId}' and team = '${team}'`
	db.all(sql,[], callback)
}

//update sprint 
const updateSprint = (sprintId, projectId,sprintSettings, sprintUsers, sprintTickets, team,callback)=>{

	console.log("***********************"+team)

	const sql = `UPDATE drafts SET sprint_settings = '${sprintSettings}', sprint_users =  '${sprintUsers}', sprint_tickets = '${sprintTickets}'  where sprint_id = '${sprintId}' and project_id = '${projectId}' and team = '${team}'`
	db.all(sql,[], callback)
}


//get sprint list
const sprintList = (projectId,callback)=>{
	console.log("*************"+projectId)
	const sql = `SELECT DISTINCT sprint_id FROM drafts where project_id = '${projectId}'`
	db.all(sql,[], callback)
}




//check if sprint exists
const sprintExists = (sprintId, team,callback)=>{
	console.log("*************"+sprintId)
	const sql = `SELECT EXISTS(SELECT project_id FROM drafts WHERE sprint_id='${sprintId}' and team='${team}' )`
	// const sql = `SELECT DISTINCT project_id FROM drafts where project_id = '${projectId}'`
	db.all(sql,[], callback)
}


//Settings methods ----------

//create new settings
const createSettings = (projectId, zsProjectId, projectSettings, qaHrKey, devHrKey, qaUserField, zsProjectName, zsPassKey, zsSprintKey ,callback)=>{
	const sql = `INSERT INTO settings (project_id, zs_project_Id, project_settings, qa_hr_key, dev_hr_key, qa_user_field, zs_project_name, pass_key, zs_sprint_key) values (?,?,?,?,?,?,?,?,?)`
	db.run(sql,[projectId, zsProjectId, projectSettings, qaHrKey, devHrKey, qaUserField, zsProjectName, zsPassKey,zsSprintKey],(err)=>{
		callback(err, {id: this.lastID})
	})

}


//get settings
const getSettings = (zsProjectId,callback)=>{
	console.log("+++++++++++"+zsProjectId)
	const sql = `SELECT * FROM settings WHERE zs_project_Id = '${zsProjectId}'`
	db.all(sql,[], callback)
}

//get all settings
const getAllSettings = (callback)=>{
	const sql = `SELECT * FROM settings`
	db.all(sql,[], callback)
}

//check project list
const projectList = (projectId,callback)=>{
	console.log("*************"+projectId)
	const sql = `SELECT DISTINCT project_id FROM settings where zs_project_Id = '${projectId}'`
	db.all(sql,[], callback)
}


//delet project
const projectDelete = (id, callback)=>{
	console.log("*************"+id)
	const sql = `DELETE FROM settings where id = '${id}'`
	db.all(sql,[], callback)
}

//update sprint 
const updateSettings = (id, projectId, zsProjectId, projectSettings, qaHrKey, devHrKey, qaUserField, zsProjectName, zsPassKey, zsSprintKey ,callback)=>{
	console.log("---------zsProjectId-----------"+JSON.stringify(projectSettings))
	console.log("---------updateSettings-----------"+JSON.stringify(projectSettings))
	
	const sql = `UPDATE settings SET project_id = '${projectId}', zs_project_Id =  '${zsProjectId}', project_settings = '${projectSettings}', qa_hr_key = '${qaHrKey}', dev_hr_key = '${devHrKey}', qa_user_field = '${qaUserField}', zs_project_name = '${zsProjectName}', pass_key = '${zsPassKey}', zs_sprint_key = '${zsSprintKey}'  where id = '${id}'`
	db.all(sql,[], callback)
}


//confirm pin 
const getSprintPin = (id, callback)=>{
	console.log("*************"+id)
	const sql = `Select * from settings where id = '${id}'`
	db.all(sql,[], callback)
}




module.exports = {
	createSprint, 
	getSprint, 
	updateSprint, 
	sprintList, 
	projectList, 
	sprintExists, 
	createSettings,
	getSettings,
	updateSettings,
	getAllSettings,
	projectDelete,
	getSprintPin
}