import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    age: {type: Number, required: false},
    bloodGroup: {type: String, required: false},
    dob: {type: Date, required: false},
    allergies: {type: String, required: false},
    weight: {type: Number, required: false},
    phone: {type: String, required: false},
    emergencyContact: {type: String, required:false}
},
{
    'timestamps': true
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

// method to compare passwords
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;