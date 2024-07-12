const users = require('../Models/userSchema'); 
const moment = require('moment');

const csv = require("fast-csv");
const fs = require('fs');

//Register user
exports.registerData= async (req, res)=>{
    // console.log(req.file);
    //console.log(req.body);

    const file = req.file.filename;
    const {fname,lname,email,mobile,gender,location,status}=req.body;

    if(!fname || !lname || !email || !mobile || !gender || !location || !status || !file){
        res.status(400).json({msg:"Please Enter All Fields!"});
    }

    try {
        const peruser = await users.findOne({email:email});

        if(peruser){
            res.status(400).json({msg:"User Already Exist!"});
        }else{
            const dateCreated = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
            const newUser = new users({
                fname:fname,
                lname:lname,
                email:email,
                mobile:mobile,
                gender:gender,
                location:location,
                status:status,
                image:file,
                dateCreated:dateCreated
            });
            await newUser.save();
            res.status(200).json(newUser);
        }
    } catch (error) {
        res.status(400).json({"error": error});
        console.log(error);
    }
}






//Get all user information
exports.displayDetails= async (req, res)=>{
    //console.log(req.query);
    const search = req.query.search || "";
    const gender = req.query.gender || "";
    const status = req.query.status || "";
    const sort = req.query.sort || "";
    const page = req.query.page || 1  ;
    const ITEM_PER_PAGE = 4;

    const query ={
        fname : {$regex: search,$options:"i"}               //Note :- $regex is used for search and if first letter is capital or small $options:"i" is used to considered both
    } 
    
    // filter by gender
    if(gender!=="All"){
        query.gender = gender;
    }

    // filter by status
    if(status!=="All"){
        query.status = status;
    }

    try {
        const skip = (page-1)*ITEM_PER_PAGE;            // (1-1) * 4 => 0  Or  (2-1) * 4 => 4   Or  (3-1) * 4 => 8 
        const count = await users.countDocuments(query)  // Number of records available.
        // console.log(count)


        // sort records by old or new 
        const All_userData =await users.find(query)
        .sort({dateCreated:sort == "new"? -1 :1})
        .limit(ITEM_PER_PAGE)
        .skip(skip);

        const pageCount = Math.ceil(count / ITEM_PER_PAGE);

        res.status(200).json({ 
        Pagination:{ count,pageCount },
        All_userData})
    } catch (error) {
        res.status(400).json({"error": error});
    }
}




//get Single User information
exports.getSingleUserData=async (req, res)=>{
        const {id} = req.params;
        try {
            const Single_userData = await users.findOne({_id:id})
            res.status(200).json(Single_userData)
        } catch (error) {
            res.status(400).json({"error": error});
        }
}


// Edit User Profile information
exports.EditUserProfile=async(req,res)=>{
    const {id} = req.params;
    const {fname,lname,email,mobile,gender,location,status,user_profile_image}=req.body;
    const file = req.file ? req.file.filename : user_profile_image;

    const dateUpdated = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');

    try {
        const UpdateUser = await users.findByIdAndUpdate({_id:id},{
            fname:fname,
            lname:lname,
            email:email,
            mobile:mobile,
            gender:gender,
            location:location,
            status:status,
            image:file,
            dateUpdated:dateUpdated,            
        },{new : true});
        await UpdateUser.save();
        res.status(200).json(UpdateUser);

    } catch (error) {
        res.status(400).json({"error": error});
    }
}



// Delete User Profile information
exports.deleteUserData=async(req,res)=>{
    const {id} = req.params;
    try {
        const deleteUser = await users.findByIdAndDelete({_id:id});
        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(400).json({"error": error});
    }   
}


// Update Status
exports.UpdateStatus=async(req,res)=>{
    const {id} = req.params;
    const {status} = req.body;
    

    try {
        const UpdateUserStatus = await users.findByIdAndUpdate({_id:id},{
            status:status,            
        },{new : true});
        await UpdateUserStatus.save();
        res.status(200).json(UpdateUserStatus);

    } catch (error) {
        res.status(400).json({"error": error});
    }
}



// Download csv file
exports.UserExport=async(req,res)=>{
        try {
            const usersdata = await users.find();
            const csvStream = csv.format({headers: true});

            if(!fs.existsSync("public/files/export")){
                if(!fs.existsSync("public/files")){
                    fs.mkdirSync("public/files/");
                }
                if(!fs.existsSync("public/files/export")){
                    fs.mkdirSync("public/files/export");
                }
            }

            const writableStream = fs.createWriteStream("public/files/export/users.csv");
            csvStream.pipe(writableStream);

            writableStream.on("finish", () => {
                res.json({
                    downloadUrl:`${process.env.BASE_URL}/files/export/users.csv`
                })
            });

            if(usersdata.length > 0){
                usersdata.map(user => {
                    csvStream.write({
                        FirstName:user.fname ? user.fname :"-",
                        LastName:user.lname ? user.lname :"-",
                        Email:user.email ? user.email :"-",
                        Mobile:user.mobile ? user.mobile :"-",
                        Gender:user.gender ? user.gender :"-",
                        Location:user.location ? user.location :"-",
                        Status:user.status ? user.status :"-",
                        Image:user.image ? user.image :"-",
                        DateCreated:user.dateCreated ? user.dateCreated :"-",
                        DateUpdated:user.dateUpdated ? user.dateUpdated :"-",
                    });
                });
                csvStream.end();
                writableStream.end();
            }

        } catch (error) {
            res.status(400).json({"error": error});
        }
}
