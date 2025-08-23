const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    dairyEntries: [{
        type: Schema.Types.ObjectId,
        ref: 'DairyEntry'
    }],
    profile: {
        firstName: String,
        lastName: String,
        bio: String,
        dateOfBirth: Date
    }
});

userSchema.plugin(passportLocalMongoose);//automatically implement salting hasshing and generation of username and password
//also methods

module.exports = mongoose.model('User', userSchema);