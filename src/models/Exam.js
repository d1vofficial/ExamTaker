const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const optionSchema = new Schema({
//   option: {
//     type: String,
//     required: true
//   }
// });

// const questionSchema = new Schema({
//     question: {
//         type: String,
//         required: true
//     },
    
//     answer:{
//       type: String,
//       default: ""
//     }

// }, {
//     timestamps: true
// });
const examSchema = new Schema({
    // student_id :{
    //     type: m
    // }
    name: {
        type: String,
        required: true,
        unique: true,
    },

    isEnabled: {
        type: Boolean,
        default: true
    },

    questions: [
        {
            question: {
                type: String,
                required: true
            },
        
        }, {
            timestamps: true
        }
    ]

    // duration :{
    //   hours : {
    //     type : Number,
    //     default: 0
    //   },

    //   minutes : {
    //     type : Number,
    //     default: 0
    //   },

    //   seconds : {
    //     type : Number,
    //     default: 0
    //   }

    // }
}, {
    timestamps: true
});

var Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;

// delete mongoose.connection.models['Exam']; //testing purpose
