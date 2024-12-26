const express = require('express')
const app = express()
const axios = require('axios')
const urls = require("./urls.js")
const {
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
  getSprintPin,
  sprintDelete
} = require('./executions.js')
app.use(express.json());

// get data from jira using jql
app.get("/jiraQueryCount/:id",async(req,res)=>{
  var tempParams = req.params.id.split(":")
  const response = await axios.request({
        method: 'GET',
        url: "https://zsassociates.atlassian.net/rest/api/3/search?jql="+tempParams[1],
        headers: {
          'Authorization': tempParams[0],
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
          }
        })
      .then(response => {
        res.json(response.data)
      })
      .catch(error => {
        console.log("Error:::::::::::::::::::::"+error);
        res.json(error)
      });
})


// get all user data from a project
app.get("/jiraUserList/:id",async(req,res)=>{
  var tempParams = req.params.id.split(":")

    const response = await axios.request({
        method: 'GET',
        url: "https://zsassociates.atlassian.net/rest/api/3/user/assignable/search?"+tempParams[1],
        headers: {
          'Authorization': tempParams[0],
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
          }
        })
      .then(response => {
        res.json(response.data)
      })
      .catch(error => {
        console.log("Error:::::::::::::::::::::"+error);
        res.json(error)
      });
})


// get all data from sql
app.get("/sprint",async(req,res)=>{

    await getSprint(req.query.sprintId, req.query.projectId, req.query.team,(err,rows)=>{
      if(err){
        res.status(500).send(err.message)
      }else{
        res.status(200).json(rows)
      }
    })
})



//create new sprint in sql
app.post("/sprint",async(req,res)=>{  
    const {sprintId, projectId, sprintSettings, sprintUsers, sprintTickets, team} = req.body

    await createSprint(sprintId, projectId, sprintSettings, sprintUsers, sprintTickets, team,(err,data)=>{
      if(err){
        res.status(500).send(err.message)
      }else{
        res.status(200).json(`New Sprint created id: ${JSON.stringify(data)}`)
      }
    })
})


//update row in sql
app.put("/sprint:id",async(req,res)=>{  

    const {sprintId, projectId, sprintSettings, sprintUsers, sprintTickets, team} = req.body
    await updateSprint(sprintId, projectId , sprintSettings, sprintUsers, sprintTickets, team,(err,data)=>{
        if(err){
          res.status(500).send(err.message)
        }else{
          res.status(200).json(`Data updated`)
        }
    })
})


//get sprint list in sql
app.get("/sprintList",async(req,res)=>{  
    const projectId = req.query.id

    await sprintList(projectId,(err,data)=>{
      if(err){
        res.status(500).send(err.message)
      }else{
        res.status(200).json(data)
      }
    })
})


//check project available
app.get("/projectList",async(req,res)=>{  
    const projectId = req.query.id

    await projectList(projectId,(err,data)=>{
      if(err){
        res.status(500).send(err.message)
      }else{
        res.status(200).json(data)
      }
    })
})


//check sprint exist
app.get("/sprintExists",async(req,res)=>{  
    const projectId = req.query.id
    const team = req.query.team
    await sprintExists(projectId,team,(err,data)=>{
      if(err){
        res.status(500).send(err.message)
      }else{
        var responseData = Object.values(data[0])[0]
        res.status(200).json(responseData)
      }
    })
})


// delete sprint from sql
app.delete("/sprint",async(req,res)=>{

    await sprintDelete(Number(req.query.id),(err,rows)=>{
      if(err){
        res.status(500).send(err.message)
      }else{
        res.status(200).json('Project deleted')
      }
    })
})


//settings api -------


//create new ssettings 
app.post("/settings",async(req,res)=>{  
    const {projectId, zsProjectId, projectSettings, qaHrKey, devHrKey, qaUserField, zsProjectName, zsPassKey, zsSprintKey} = req.body

    await createSettings(projectId, zsProjectId, projectSettings, qaHrKey, devHrKey, qaUserField, zsProjectName, zsPassKey, zsSprintKey, (err,data)=>{
      if(err){
        res.status(500).send(err.message)
      }else{
        res.status(200).json(`New settings created id: ${JSON.stringify(data)}`)
      }
    })
})


// get settings from sql
app.get("/settings",async(req,res)=>{
    await getSettings(req.query.projectId,(err,rows)=>{
      if(err){
        res.status(500).send(err.message)
      }else{
        res.status(200).json(rows)
      }
    })
})

// get all settings from sql
app.get("/allSettings",async(req,res)=>{
    await getAllSettings((err,rows)=>{
      if(err){
        res.status(500).send(err.message)
      }else{
        res.status(200).json(rows)
      }
    })
})

// update settings from sql
app.put("/settings",async(req,res)=>{
    const {projectId, zsProjectId, projectSettings, qaHrKey, devHrKey, qaUserField, zsProjectName, zsPassKey, zsSprintKey} = req.body
    await updateSettings(Number(req.query.id), projectId, zsProjectId, projectSettings, qaHrKey, devHrKey, qaUserField, zsProjectName, zsPassKey, zsSprintKey ,(err,rows)=>{
      if(err){
        res.status(500).send(err.message)
      }else{
        res.status(200).json('Data updated')
      }
    })
})


// delete settings from sql
app.delete("/settings",async(req,res)=>{

    await projectDelete(Number(req.query.id),(err,rows)=>{
      if(err){
        res.status(500).send(err.message)
      }else{
        res.status(200).json('Project deleted')
      }
    })
})

// get confirm pin validate
app.get("/settings/sprint/auth",async(req,res)=>{
    await getSprintPin(Number(req.query.id),(err,rows)=>{
      if(err){
        res.status(500).send(err.message)
      }else{
        if(rows[0].pass_key === req.query.pass){
          res.status(200).json({status: 200, message: "login successful"})
        }else{
          res.status(401).json({status: 401, message: "login failed"})
        }
        
      }
    })
})

// get sprintlist of a project
app.get("/projectSprintList/:id",async(req,res)=>{
  var tempParams = req.params.id.split(":")

  const response = await axios.request({
        method: 'GET',
        url: "https://zsassociates.atlassian.net/rest/greenhopper/latest/sprintquery/"+tempParams[1]+"?includeHistoricSprints=true&includeFutureSprints=true",
        headers: {
          'Authorization': tempParams[0],
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
          }
        })
      .then(response => {
        res.json(response.data)
      })
      .catch(error => {
        console.log("Error::::::projectSprintList:::::::::::::::"+error);
        res.json(error)
      });
})


// assign Sprint to jira tickets
app.get("/assignSprint/:id",async(req,res)=>{
  var tempParams = req.params.id.split(":")
  var jiraID = tempParams[1]
  var customFiledName = tempParams[2]
  var sprintId = tempParams[3]
  var category = tempParams[4]
  var spillHours = tempParams[5]

  var data = {}

  if (category === "SPILLOVERS") {
    data =  JSON.stringify({
          "fields": {
              [customFiledName]: Number(sprintId)
          },
          "update": {
                  "timetracking": [
                      {
                          "edit": {
                              "remainingEstimate": spillHours
                          }
                      }
                  ]
              }
      })

  }else{
    data =  JSON.stringify({"fields": {
                    [customFiledName]: Number(sprintId)
                  }
              })
  }

  const response = await axios.request({
        method: 'PUT',
        url: `https://zsassociates.atlassian.net/rest/api/3/issue/${jiraID}`,
        headers: {
          'Authorization': tempParams[0],
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
          data: data
        })
      .then(response => {
        res.json(response.data)
      })
      .catch(error => {
        console.log("Error::::::projectSprintList:::::::::::::::"+error);
        res.json(error)
      });
})


// get worklogs
app.get("/worklog/:id",async(req,res)=>{
  var tempParams = req.params.id.split(":")

  const response = await axios.request({
        method: 'GET',
        url: "https://zsassociates.atlassian.net/rest/api/2/issue/"+tempParams[1]+"/worklog",
        headers: {
          'Authorization': tempParams[0],
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
          }
        })
      .then(response => {
        res.json(response.data)
      })
      .catch(error => {
        console.log("Error::::::projectSprintList:::::::::::::::"+error);
        res.json(error)
      });
})






app.listen(5000,()=>{console.log("server started on port 5000")})