const req = require('supertest')
const app = require('../index')
const { User, Photo, Comment } = require('../models')
const { generateToken } = require('../helpers/jwt')

describe("POST /comments", ()=>{
    let token
    let PhotoId
    let UserId

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
              PhotoId = photo.id
              UserId = user.id
        }catch(err){
            throw err
        }
    })
    it('should be response 201',(done)=>{
        req(app)
        .post('/comments/')
        .set({token})
        .send({
            UserId: UserId,
            PhotoId: PhotoId,
            comment: "Comment Gambar"
        })
        .expect(201)
        .end((err,res)=>{
            try{
            if (err){done(err)}
            expect(res.body.comment).toHaveProperty("id")
            expect(res.body.comment).toHaveProperty("UserId")
            expect(res.body.comment).toHaveProperty("PhotoId")
            expect(res.body.comment).toHaveProperty("comment")
            expect(res.body.comment).toHaveProperty("createdAt")
            expect(res.body.comment).toHaveProperty("updatedAt")
            }catch(err){
                err.message= `${err.message}`
                console.log(err);
            }
            done()
        })
    })
    
    it('should be response 500', (done)=>{
        req(app)
        .post('/comments/')
        .set({token})
        .send({
            comment: "",
            UserId: 'comment',
            PhotoId: PhotoId,
        })
        .expect(500)
        .end((err,res)=>{
        try{
        if (err){done(err)}
        expect(res.body).toHaveProperty('status')
        expect(res.body.status).toEqual(500)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toHaveProperty('name')
        expect(res.body.message).toHaveProperty('errors')
        }catch(err){
            err.message= `${err.message}`
            console.log(err);
    }
        done()
    })
    
})

        it('should be response 401', (done)=>{
            req(app)
            .post('/comments/')
            .send({
                UserId: UserId,
                PhotoId: PhotoId,
                comment: "Comment Gambar"
            })
            .expect(401)
            .end((err,res)=>{
            try{
            if (err){done(err)}
            expect(res.body).toHaveProperty("code")
            expect(res.body).toHaveProperty("message")
            expect(res.body.code).toEqual(401)
            expect(res.body.message).toEqual("Token not provided!")
            expect(res.status).toEqual(401)
            
            }catch(err){
                err.message= `${err.message}`
                console.log(err);
            }
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
              await Comment.destroy({
                where:{},
              })
    
            } catch (err) {
              console.log(err)
            }
          })
})

describe("GET /photo/",()=>{
            let token
            let PhotoId
            let UserId

        
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
                      PhotoId = photo.id
                      UserId = user.id

                      const comment = await Comment.create({
                        UserId: UserId,
                        PhotoId: PhotoId,
                        comment: "Comment Gambar"
                    })

                }catch(err){
                    throw err
                }
            })
        
            it('should be response 200',(done)=>{
                req(app)
                .get('/comments/')
                .set({token})
                .expect(200)
                .end((err,res)=>{
                    if (err){done(err)}else{
                        console.log(res);
                    }
                    expect(res.body[0]).toHaveProperty("id")
                    expect(res.body[0]).toHaveProperty("UserId")
                    expect(res.body[0]).toHaveProperty("PhotoId")
                    expect(res.body[0]).toHaveProperty("comment")
                    expect(res.body[0]).toHaveProperty("createdAt")
                    expect(res.body[0]).toHaveProperty("updatedAt")
                    done()
                })
                
            })
        
            it('should be response 401',(done)=>{
                req(app)
                .get('/comments/')
                .expect(401)
                .end((err,res)=>{
                    if (err){done(err)}
                    expect(res.body).toHaveProperty('code')
            expect(res.body.code).toEqual(401)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toEqual('Token not provided!')
            expect(typeof res.body.message).toEqual('string')
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

            await Comment.destroy({
            where: {},
            })
        } catch (err) {
            console.log(err)
            console.log(token);
        }
    })
})

describe("PUT /comments/:commentsId", ()=>{
    let token
    let PhotoId
    let UserId
    let CommentId
    let CommentId1

    beforeAll(async ()=>{
        try{
            const user = await User.create({
                full_name: "Admin admin",
                email: "admin1@gmail.com",
                username: "admin1",
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
              PhotoId = photo.id
              UserId = user.id

              const comment = await Comment.create({
                UserId: UserId,
                PhotoId: PhotoId,
                comment: "Comment Gambar"
            })
            CommentId=comment.id
            CommentId1=CommentId+1
        }catch(err){
            console.log(err);
        }
    })
    
    it('should be response 200',(done)=>{
        req(app)
        .put(`/comments/${CommentId}`)
        .set({token})
        .send({
            UserId:UserId,
            PhotoId:PhotoId,
            comment:'update comment gambar' 
        })
        .expect(200)
        .end((err,res)=>{
            if (err){done(err)}
            console.log(res.body);
            expect(res.body.comment).toHaveProperty("id")
            expect(res.body.comment).toHaveProperty("UserId")
            expect(res.body.comment).toHaveProperty("PhotoId")
            expect(res.body.comment).toHaveProperty("comment")
            expect(res.body.comment).toHaveProperty("updatedAt")
            expect(res.body.comment).toHaveProperty("createdAt")
        done()
        
        })
        
    })

    it('should response 401', (done)=>{
        req(app)
        .put(`/comments/${CommentId}`)
        .send({
            UserId:UserId,
            PhotoId:PhotoId,
            comment:'update comment gambar' 
        })
        .expect(401)
        .end((err,res)=>{
            
                if (err){done(err)}
                console.log(res.body);

        expect(res.body).toHaveProperty("code")
        expect(res.body).toHaveProperty("message")
        expect(res.body.code).toEqual(401)
        expect(res.body.message).toEqual('Token not provided!')   
        expect(res.status).toEqual(401)     
        done()    
        })
        
    })

    it('should be response 404',(done)=>{
        req(app)
        .put(`/comments/${CommentId1}`)
        .set({token})
        .send({
            UserId:UserId,
            PhotoId:PhotoId,
            comment:'update comment gambar' 
        })
        .expect(404)
        .end((err,res)=>{
            if (err){
                done(err)
            }else{              
              expect(res.body).toHaveProperty('error')
                expect(res.body.error).toEqual('Comment Not Found')
                expect(res.body).toHaveProperty('Message')
                expect(typeof res.body.error).toEqual('string')
                expect(typeof res.body.Message).toEqual('string')
            }
            done()  
        })
        
    })

    it('should response 500', (done)=>{
        req(app)
        .put(`/comments/${CommentId}`)
        .set({token})
        .send({
            UserId:UserId,
            PhotoId:PhotoId,
            comment:'' 
        })
        .expect(500)
        .end((err,res)=>{
           
                if (err){done(err)}
                expect(res.body).toHaveProperty('status')
                expect(res.body.status).toEqual(500)
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toHaveProperty('name')
                expect(res.body.message).toHaveProperty('errors')
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

            await Comment.destroy({
            where: {},
            })
        } catch (err) {
            console.log(err)
        }
    })  
})

describe("DELETE /comments/commentId", ()=>{
    let token
    let PhotoId
    let UserId
    let UserId1
    let CommentId
    let CommentId1
    let CommentId2=1

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
            
              const user1 = await User.create({
                full_name: "Admin admin1",
                email: "admin1@gmail.com",
                username: "admin1",
                password: "admin1",
                profile_image_url: "https://gambar1.com",
                age:"26",
                phone_number:"085412372833"
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
              PhotoId = photo.id
              UserId = user.id
              UserId1 = user1.id

              const comment = await Comment.create({
                UserId: UserId,
                PhotoId: PhotoId,
                comment: "Comment Gambar"
            })
            const comment1 = await Comment.create({
                UserId: UserId1,
                PhotoId: PhotoId,
                comment: "Comment Gambar1"
            })
            CommentId=comment.id
            CommentId1=comment1.id
        }catch(err){
            throw err
        }
    })
it("should response 200", (done)=>{
    req(app)
    .delete(`/comments/${CommentId}`)
    .set({token})
    .expect(200)
    .end((err, res) => {
        if (err) {
            done(err)
        }

        // console.log(res.body);
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Your Comment has been successfully deleted')
        expect(res.body).not.toHaveProperty("id")
        expect(res.body).not.toHaveProperty("UserId")
        expect(res.body).not.toHaveProperty("PhotoId")
        expect(res.body).not.toHaveProperty('comment')    
    done()
    })

})
    
it("should response 401", (done)=>{
    req(app)
    .delete(`/comments/${CommentId}`)
    .expect(401)
    .end((err, res)=>{
        if(err){
        done(err)
            }
            expect(res.body).toHaveProperty("code")
            expect(res.body).toHaveProperty("message")
            expect(res.body.code).toEqual(401)
            expect(res.body.message).toEqual("Token not provided!")
            expect(res.status).toEqual(401)
    
        done()
    })
    
})

it("should response 404", (done)=>{
    req(app)
    .delete(`/comments/${CommentId2}`)
    .set({token})
    .expect(404)
    .end((err, res)=>{
        if(err){
        done(err)
            }
            expect(res.body).toHaveProperty('error')
            expect(res.body.error).toEqual('Comment Not Found')
            expect(res.body).toHaveProperty('Message')
            expect(typeof res.body.error).toEqual('string')
            expect(typeof res.body.Message).toEqual('string')
    
        done()
    })
    
})

it("should response 403", (done)=>{
    req(app)
    .delete(`/comments/${CommentId1}`)
    .set({token})
    .expect(403)
    .end((err, res)=>{
        if(err){done(err)}
        expect(res.body).toHaveProperty('error')
        expect(res.body).toHaveProperty('Message')
        expect(res.body.error).toEqual('Authorization Error')
        expect(typeof res.body.error).toEqual('string')
        expect(typeof res.body.Message).toEqual('string')
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

            await Comment.destroy({
            where: {},
            })
        } catch (err) {
            console.log(err)
        }
    })
})  