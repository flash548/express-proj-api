const express = require('express')
const { response } = require('express')
const app = express()
const port = 3000


// mock in memory database
var data = [
    { id: 1, name: 'Joe', grades: ['A'] },
    { id: 2, name: 'Jeff', grades: ['C'] },
    { id: 3, name: 'Alice', grades: ['B'] },
    { id: 4, name: 'Heather', grades: ['D'] },
    { id: 5, name: 'Elmo', grades: ['F'] },
    { id: 6, name: 'Yoda', grades: ['B'] },
]

app.use(express.json())


// dumps all student records, if 'search' param not given
//  otherwise dump's records matching 'search' param
app.get('/students', (req,res)=> {
    if (!req.query.search) { res.send(data); }  // send all data for no query
    else {
        // had a search param - service it
        let resp = []
        for (let student of data) {
            if (student.name.toLowerCase() == req.query.search.toLowerCase) { resp.push(student) }
        }

        if (res.length > 0) res.send(resp)
        else res.send("No matching names found!")
    }
})

// dumps a student's record (by-id)
app.get('/students/:studentId', (req,res)=> {
    for (let student of data) {
        if (student.id == req.params.studentId) { res.send(student); return; }
    }

    res.send("Student matching that ID not found!")
})

// gets grades for student (by-id)
app.get('/grades/:studentId', (req,res)=> {
    for (let student of data) {
        if (student.id == req.params.studentId) { res.send(student.grades); return; }
    }

    res.send("Student matching that ID not found!")
})

// adds a grade to an existing user (by-id)
app.post('/grades', (req,res)=> {
    if (!req.body.id) res.send("Failed to add grade: No student ID field given!")
    else if (!req.body.grade) res.send("Failed to add grade: No grade field given!")
    else {
        // now find the record
        // should be an existing student
        for (let student of data) {
            if (student.id == req.body.id) {
                student.grades.push(req.body.grade)
                res.send('Grade added for student ID: ' + req.body.id)
                return
            }
        }

        res.send("Failed to add grade: Student not found!")

    }
})

// adds a new user to the db, can specify either a single grade with 'grade' field (or)
//  multiple grades with 'grades' field
app.post('/register', (req,res)=> {
    if (!req.body.grade && !req.body.grades) res.send("Failed to add grade(s): No grade(s) field given!")
    else if (!req.body.name) res.send("Failed to add grade: No grade field given!")
    else {
        // add the user to data structure

        // get a new user id
        let highestId = 0;
        for (let student of data) {
            if (student.id > highestId) highestId = student.id
        }

        let newId = highestId+1;

        let newGrades = null
        if (req.body.grade) newGrades = [ req.body.grade ]
        else newGrades = req.body.grades 

        let newStudent = { id: newId, name: req.body.name, grades: newGrades }
        data.push(newStudent)

        res.send("New Student added with ID: " + newId)

    }
})

app.listen(port, () => console.log(`API app listening at http://localhost:${port}`))