const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const uuid = require('node-uuid');

let exportedMethods = {
    
    // getAllTasks return list from tasks collection either or not using parameters skip and take
    getAllTasks(type, value) {
        
        // default call if skip or take is not defined
        if(type === null && value === null) {
            return tasks().then((taskCollection) => {
                return taskCollection.find({}).limit(20).toArray();
            });
        }

        // call if skip is defined
        else if(type == "skip" && value!= undefined) {
            return tasks().then((taskCollection) => {
                return taskCollection.find({}).limit(20).skip(parseInt(value)).toArray();
            });
        }
        
        // call if take is defined
        else if(type == "take" && value!= undefined) {
            if(parseInt(value) > 100) { value = 100 }
            return tasks().then((taskCollection) => {
                return taskCollection.find({}).limit(parseInt(value)).toArray();
            });
        }
    },

    // getTaskById returns specific task for provided ID
    getTaskById(id) {
        return tasks().then((taskCollection) => {
            return taskCollection.findOne({ _id: id }).then((task) => {
                if (!task) throw "Record Not Found";
                return task;
            });
        });
    },
    
    // addTask add a new Task in database and returns that task
    addTask(title, description, hoursEstimated, completed) {
        return tasks().then((taskCollection) => {

            let newTask = {
                _id: uuid.v4(),
                title: title,
                description: description,
                hoursEstimated: hoursEstimated,
                completed: completed,
                comments: []
            };

            return taskCollection.insertOne(newTask).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getTaskById(newId);
            });
        });
    },
    
    // updateTask updates Task object with new details and returns that task
    updateTask(id, title, description, hoursEstimated, completed) {
        return this.getTaskById(id).then((currentTask) => {
            
            let updatedTask = {
                title: title,
                description: description,
                hoursEstimated: hoursEstimated,
                completed: completed,
                comments: currentTask.comments
            };

            let updateCommand = { 
                $set: updatedTask
            };

            return tasks().then((taskCollection) => {
                return taskCollection.updateOne({ _id: id }, updatedTask).then(() => {
                    return this.getTaskById(id);
                });
            });
        });
    },
    
    // updateTaskPartically updates Task object with new details and returns that task
    updateTaskPartically(id, updatedTask) {
        return this.getTaskById(id).then((currentTask) => {

            let updateTask = {
                title: updatedTask["title"]? updatedTask["title"]: currentTask.title,
                description: updatedTask["description"]? updatedTask["description"] : currentTask.description,
                hoursEstimated: updatedTask["hoursEstimated"]? updatedTask["hoursEstimated"] : currentTask.hoursEstimated,
                completed: updatedTask["completed"]?  updatedTask["completed"] : currentTask.completed,
                comments: currentTask.comments
            };

            let updateCommand = { 
                $set: updatedTask
            };

            return tasks().then((taskCollection) => {
                return taskCollection.update({ _id: id }, updateTask).then(() => {
                    return this.getTaskById(id);
                });
            });
        });
    },

    // addCommentToTask add a new comment in a Task and returns that task
    addCommentToTask(id, name, comment) {
        let commentObject = {
            _id: uuid.v4(),
            name: name,
            comment: comment
        }
    
        return tasks().then((taskCollection) => {
            return taskCollection.update({ _id: id }, { $push: { comments: commentObject }}).then(() => {
                return this.getTaskById(id);
            });
        });
    },
    
    // deleteComment delete a comment in a Task and returns that task
    deleteComment(taskId, commentId) {
        return tasks().then((taskCollection) => {
            return taskCollection.update({ _id: taskId }, { $pull: { comments: {_id: commentId} }}).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete comment with id of ${commentId}`)
                }
                return this.getTaskById(taskId);
            });
        });
    },
}

module.exports = exportedMethods;
