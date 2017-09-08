const express = require('express');
const router = express.Router();
const data = require("../data");
const taskData = data.tasks;

// method(get) route(/api/tasks/) 
router.get("/", (req, res) => {
    
    if(req.query.skip != undefined) {
        taskData.getAllTasks("skip", req.query.skip).then((taskList) => {
            res.status(200).json(taskList);
        }, (error) => {
            res.status(500).json({ error: "Internal Server Error" });
        });
    } 

    else if(req.query.take != undefined) {
        taskData.getAllTasks("take", req.query.take).then((taskList) => {
            res.status(200).json(taskList);
        }, (error) => {
            res.status(500).json({ error: "Internal Server Error" });
        });
    }

    else {
        taskData.getAllTasks(null, null).then((taskList) => {
            res.status(200).json(taskList);
        }, () => {
            res.status(500).json({ error: "Internal Server Error" });
        });
    }
    
});

// method(get) route(/api/tasks/:id) 
router.get("/:id", (req, res) => {
    taskData.getTaskById(req.params.id).then((task) => {
        res.status(200).json(task);
    }, (error) => {
        res.status(404).json({ error: error });
    });
});

// method(post) route(/api/tasks/) 
router.post("/", (req, res) => {
    
    let taskInfo = req.body;

    if(!taskInfo.title) {
        res.status(400).json({ error: "Title must be provided to create a Task" });
        return;
    }

    if(!taskInfo.description) {
        res.status(400).json({ error: "Description must be provided to create a Task" });
        return;
    }

    if(!taskInfo.hoursEstimated) {
        res.status(400).json({ error: "Estimated Hours must be provided to create a Task" });
        return;
    }

    if(taskInfo.completed === undefined) {
        res.status(400).json({ error: "Task Status must be provided to create a Task" });
        return;
    }

    taskData.addTask(taskInfo.title, taskInfo.description, taskInfo.hoursEstimated, taskInfo.completed).then((task) => {
        res.json(task);
    }, (error) => {
        res.status(500).json({ error: "Internal error" });
    });
});

// method(put) route(/api/tasks/:id) 
router.put("/:id", (req, res) => {
    
    let taskInfo = req.body;
    
    if(!taskInfo.title) {
        res.status(400).json({ error: "Title must be provided to create a Task" });
        return;
    }

    if(!taskInfo.description) {
        res.status(400).json({ error: "Description must be provided to create a Task" });
        return;
    }

    if(!taskInfo.hoursEstimated) {
        res.status(400).json({ error: "Estimated Hours must be provided to create a Task" });
        return;
    }

    if(taskInfo.completed === undefined) {
        res.status(400).json({ error: "Task Status must be provided to create a Task" });
        return;
    }
    
    taskData.updateTask(req.params.id, taskInfo.title, taskInfo.description, taskInfo.hoursEstimated, taskInfo.completed).then((task) => {
        res.json(task);
    }, (error) => {
        res.status(500).json({ error: "Internal Server Error" });
    });
});

// method(patch) route(/api/tasks/:id) 
router.patch("/:id", (req, res) => {
    
    taskData.updateTaskPartically(req.params.id, req.body).then((task) => {
        res.json(task);
    }, (error) => {
        res.status(500).json({ error: "Internal error" });
    });
});

// method(post) route(/api/tasks/:id/comments)
router.post("/:id/comments", (req, res) => {
    
    let commentInfo = req.body;

    if(!commentInfo.name) {
        res.status(400).json({ error: "Name must be provided to create a Comment" });
        return;
    }

    if(!commentInfo.comment) {
        res.status(400).json({ error: "Comment must be provided to create a Comment" });
        return;
    }
    
    taskData.addCommentToTask(req.params.id, commentInfo.name, commentInfo.comment).then((task) => {
        res.json(task);
    }, (error) => {
        res.status(500).json({ error: "Internal Server Error" });
    });
});

// method(delete) route(/api/tasks/:taskId/commentId)
router.delete("/:taskId/:commentId", (req, res) => {
    
    taskData.deleteComment(req.params.taskId, req.params.commentId).then((task) => {
        res.json(task);
    }, (error) => {
        res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;