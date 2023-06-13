const req = require('supertest')
const app = require('../index')
const { User, Photo } = require('../models')
const { generateToken } = require("../helpers/jwt")

describe("POST /photo/",()=>{
    let token
    let id
    let User_id

    beforeAll(async ()=>{
        try{
            const user = await User.create({
                full_name: "Admin admin",
                email: "admin@gmail.com",
                username: "admin",
                password: "admin",
                profile_image_url: "https://gambar.com",
                age:"22",
                phone_number:"085412356755"
              })
         
            token = await generateToken({
                id: user.id,
                email: user.email,
                username: user.username,
              })
            
              const photo = await Photo.create({
                title: "Gambar",
                caption: "Caption Gambar",
                poster_image_url: "https://gambar.com",
                UserId: user.id,
              })
              id = photo.id
              User_id = user.id
        }catch(err){
            throw err
        }
    })
    //test create photo success
    it('should be response 201',(done)=>{
        req(app)
        .post('/photos/')
        .set({token})
        .send({
            title: "Gambar1",
            caption: "Caption Gambar1",
            poster_image_url: "https://gambar1.com",
            User_id : User_id
        })
        .expect(201)
        .end((err,res)=>{
            try{
            if (err){done(err)}
            expect(res.body).toHaveProperty("id")
            expect(res.body).toHaveProperty("title")
            expect(res.body).toHaveProperty("caption")
            expect(res.body).toHaveProperty("poster_image_url")
            expect(res.body).toHaveProperty("UserId")
            expect(res.body).toHaveProperty("createdAt")
            expect(res.body).toHaveProperty("updatedAt")
            }catch(err){
                err.message= `${err.message}`
                console.log(err);
            }
            done()
        })
    })
    //test create photo error karena tidak menyertakan token
    it('should be response 401',(done)=>{
        req(app)
        .post('/photos/')
        .send({
            title: "Gambar1",
            caption: "Caption Gambar1",
            poster_image_url: "https://gambar1.com",
            User_id : User_id
        })
        .expect(401)
        .end((err,res)=>{
            if (err){done(err)}
            expect(res.body).toHaveProperty("code")
            expect(res.body).toHaveProperty("message")
            done()
        })
    })

    afterAll(async () => {
        try {
          await User.destroy({
            where: {},
          })
     
          await Photo.destroy({
            where: {},
          })
        } catch (err) {
          console.log(err)
        }
      })
})

describe("GET /photo/",()=>{
    let token
    let id
    let User_id

    beforeAll(async ()=>{
        try{
            const user = await User.create({
                full_name: "Admin admin",
                email: "admin@gmail.com",
                username: "admin",
                password: "admin",
                profile_image_url: "https://gambar.com",
                age:"22",
                phone_number:"085412356755"
              })
         
            token = await generateToken({
                id: user.id,
                email: user.email,
                username: user.username,
              })
         
              const photo = await Photo.create({
                title: "Gambar Bunga",
                caption: "Bunga ini Bunga pertama",
                poster_image_url: "https://cobacoba.com",
                UserId: user.id,
              })
              id = photo.id
              User_id = user.id
        }catch(err){
            throw err
        }
    })
    //test get all photo success
    it('should be response 200',(done)=>{
        req(app)
        .get('/photos/')
        .set({token})
        .expect(200)
        .end((err,res)=>{
            if (err){done(err)}
            expect(res.body[0]).toHaveProperty("id")
            expect(res.body[0]).toHaveProperty("title")
            expect(res.body[0]).toHaveProperty("caption")
            expect(res.body[0]).toHaveProperty("poster_image_url")
            expect(res.body[0]).toHaveProperty("UserId")
            expect(res.body[0]).toHaveProperty("createdAt")
            expect(res.body[0]).toHaveProperty("updatedAt")
            expect(res.body[0]).toHaveProperty("User")
            
        })
        done()
    })
    //test get all photo error karena tidak menyertakan token
    it('should be response 401',(done)=>{
        req(app)
        .get('/photos/')
        .expect(401)
        .end((err,res)=>{
            if (err){done(err)}
            expect(res.body).toHaveProperty("code")
            expect(res.body).toHaveProperty("message")
            done()
        })
    })

    afterAll(async () => {
        try {
          await User.destroy({
            where: {},
          })
     
          await Photo.destroy({
            where: {},
          })
        } catch (err) {
          console.log(err)
        }
      })
})

describe("PUT /photo/:photoId",()=>{
    let token
    let photo_id
    let photoID = photo_id+1

    beforeAll(async ()=>{
        try{
            const user = await User.create({
                full_name: "Admin admin",
                email: "admin@gmail.com",
                username: "admin",
                password: "admin",
                profile_image_url: "https://gambar.com",
                age:"22",
                phone_number:"085412356755"
              })
         
            token = generateToken({
                id: user.id,
                email: user.email,
                username: user.username,
              })
         
              const photo = await Photo.create({
                title: "Gambar Bunga",
                caption: "Bunga ini Bunga pertama",
                poster_image_url: "https://cobacoba.com",
                UserId: user.id,
              })
              photo_id = photo.id
        }catch(err){
            throw err
        }
    })
    //test get photo by id success
    it('should be response 200',(done)=>{
        req(app)
        .put(`/photos/${photo_id}`)
        .set({token})
        .send({
          title: "Gambar1",
          caption: "Caption Gambar1",
          poster_image_url: "https://gambar1.com"
        })
        .expect(200)
        .end((err,res)=>{
            if (err){done(err)}
            expect(res.body.photo).toHaveProperty("id")
            expect(res.body.photo).toHaveProperty("title")
            expect(res.body.photo).toHaveProperty("caption")
            expect(res.body.photo).toHaveProperty("poster_image_url")
            expect(res.body.photo).toHaveProperty("UserId")
            expect(res.body.photo).toHaveProperty("createdAt")
            expect(res.body.photo).toHaveProperty("updatedAt")
            done()
        })
    })

    it('should be response 404',(done)=>{
        req(app)
        .put(`/photos/${photoID}`)
        .set({token})
        .send({
          title: "Gambar1",
          caption: "Caption Gambar1",
          poster_image_url: "https://gambar1.com"
        })
        .expect(404)
        .end((err,res)=>{
            if (err){
                done(err)
            }
            expect(res.body).toHaveProperty("code")
            expect(res.body).toHaveProperty("message")
            
        })
        done()
    })

    afterAll(async () => {
        try {
          await User.destroy({
            where: {},
          })
     
          await Photo.destroy({
            where: {},
          })
        } catch (err) {
          console.log(err)
        }
      })
})

describe("DELETE /photos/:photoId", ()=>{
    let token
    let User_id
    let photo_id

    beforeAll(async ()=>{
        try{
            const user = await User.create({
                full_name: "Admin admin",
                email: "admin@gmail.com",
                username: "admin",
                password: "admin",
                profile_image_url: "https://gambar.com",
                age:"22",
                phone_number:"085412356755"
              })
              
            token = await generateToken({
                id: user.id,
                email: user.email,
                username: user.username,
              })
              
              const photo = await Photo.create({
                title: "Gambar Bunga",
                caption: "Bunga ini Bunga pertama",
                poster_image_url: "https://cobacoba.com",
                UserId: user.id,
              })
              photo_id = photo.id
              User_id = user.id
        }catch(err){
            throw err
        }
    })

    it("should be response 200", (done)=>{
        req(app)
            .delete(`/photos/${photo_id}`)
            .set({token})
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                console.log(res.body);

                done()
            })
    })

    afterAll(async () => {
        try {
          await User.destroy({
            where: {},
          })
     
          await Photo.destroy({
            where: {},
          })
        } catch (err) {
          console.log(err)
        }
      })

})
