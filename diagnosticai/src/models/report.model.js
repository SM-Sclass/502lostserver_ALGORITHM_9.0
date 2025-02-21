import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    report: {type: String, required: true},
    diagnosisType: {type: String, required: true},

})

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;