import { createError } from "../error.js"
import Video from "../models/Video.js"
import User from "../models/User.js"

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({userId: req.user.id, ...req.body });
    try {
        const savedVideo = await newVideo.save()
        console.log(savedVideo)
        res.status(200).json(savedVideo)
    } catch (error) {
        console.error("error while saving video", error);
        next(error)
    }
}


export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        if(!video) return next(createError(404, "Video not found"))
        if(req.user.id === video.userId){
        const updatedVideo = await Video.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true}
    );res.status(200).json(updatedVideo)
        }else{
            return next(createError(403,"you can update only your video"))
        }
    } catch (error) {
        next(error)
    }
}

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        if(!video) return next(createError(404, "Video not found"))
        if(req.user.id === req.params.id){
            await Video.findByIdAndDelete(
                req.params.id
            )
            res.status(200).json("The video has been deleted")
        }else{
            return next(createError(403, "you can delete only your video"))
        }
    } catch (error) {
        next(error)
    }
    
}

export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        res.status(200).json(video)
    } catch (error) {
        next(error)
    }
}

export const addview = async (req, res, next) => {
    try {
     await Video.findById(req.params.id,{
         $inc:{views:1}
     })
        res.status(200).json("The view has been increase")
    } catch (error) {
        next(error)
    }
}

export const random = async (req, res, next) => {
    try {
        const videos = await Video.aggregate([{$sample: {size: 40}}])
        res.status(200).json(videos)
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export const trend = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({views:-1})
        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}

export const sub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const subscribedchannels = user.subscribedUsers;
        const list = await Promise.all(
            subscribedchannels.map(async (channelId) => {
                return  Video.find({userId: channelId})
            })
        )
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt))
    } catch (error) {
        console.log("look wohose error", error);
        next(error)
    }
}

export const getbytags = async (req, res, next) => {
    const tags = req.query.tags.split(",");
    try {
        const videos = await Video.find({tags: {$in: tags}}).limit(20)
        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}

export const search = async (req, res, next) => {
    const query = req.query.q
    try {
        const video = await Video.find({title: {$regex: query, $options: "i"}}).limit(40)
        res.status(200).json(video)
    } catch (error) {
        next(error)
    }
}


