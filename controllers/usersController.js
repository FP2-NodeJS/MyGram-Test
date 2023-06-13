const {User} = require("../models")

const { comparePassword } = require("../helpers/bcrypt")
const { generateToken } = require("../helpers/jwt")
const authentication = require("../middlewares/authentication")

class userController{
    static async register(req, res){
        try {
            const {
                full_name,
                email,
                username,
                password,
                profile_image_url,
                age,
                phone_number
            } = req.body

            const data = await User.create({
                email,
                full_name,
                username,
                password,
                profile_image_url,
                age,
                phone_number

              })
        
              const response = {
                user: {
                    email: data.email,
                    full_name,
                    username: data.username,
                    profile_image_url: data.profile_image_url,
                    age: data.age,
                    phone_number: data.phone_number
                }
                
              }
        
              res.status(201).json(response)
        
        } catch (error) {
            res.status(error?.code || 500).json(error.errors[0])
        }
    }
    static async login(req, res){
        try {
            const {
              email,
              password
            } = req.body

            const user = await User.findOne({
              where: {
                email: email
              }
            })
      
            if (!user) {
              throw {
                code: 404,
                message: "User not found"
              }
            }
      
            // compare password
            const isCorrect = comparePassword(password, user.password)
      
            if (!isCorrect) {
              throw {
                code: 401,
                message: "Incorrect password"
              }
            }
      
            const response = {
              id: user.id,
              email: user.email,
              username: user.username
            }
      
            const token = generateToken(response)
      
            res.status(200).json({
              token
            })
      
          } catch (error) {
            res.status(error?.code || 500).json(error)
            
          }
    }

    static async updateUser(req, res){
        try {
            const { id } = req.params    
            const {
                full_name,
                email,
                username,
                profile_image_url,
                age,
                phone_number
            } = req.body
            
            await User.update({
                full_name,
                email,
                username,
                profile_image_url,
                age,
                phone_number
            }, {
                where: {
                    id
                },
                returning: true
            }).then((result) => {
                const response = {
                    user: {
                        email : result[1][0].email,
                        full_name : result[1][0].full_name, 
                        username : result[1][0].username, 
                        profile_image_url : result[1][0].profile_image_url, 
                        age: result[1][0].age, 
                        phone_number: result[1][0].phone_number
                    }
                }
                res.status(200).json(response)
            }).catch((err) => {
                throw{
                    code: 400,
                    message: err
                }
            });
        } catch (error) {
            res.status(error?.code || 500).json(error)
        }
    
    }

    static async deleteUser(req, res){
        try {
            const { id } = req.params
            const result = await User.destroy({
                where : { id }
            })
            if(!result) {
                throw {
                    code: 404,
                    message: "data not found"
                }
            }
            res.status(200).json({"message":"your account has successfully deleted"})
        
        } catch (error) {
            res.status(error?.code || 500).json(error)
        }
    }
}   

module.exports = userController