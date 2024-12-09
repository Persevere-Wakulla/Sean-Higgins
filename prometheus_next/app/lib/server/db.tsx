
import mongoose, { Model, model, Schema } from 'mongoose'

let started = false;
let blogModel: Model<any>;

const startDB = async () => {
    const blogSchema = new Schema(
        {
            title: String,
            articleSections: Array,
            img: String,
            minRead: Number,
            articleImages: Array,
            comments: Array,
            category: String,
            views: Number
        },
        {
            collection: "blog",
            timestamps: { createdAt: "date" },
        }
    );
    blogModel = mongoose.model('blog', blogSchema)
    var mongoDB = 'mongodb://127.0.0.1/prometheus';
    started = true;
    return await mongoose.connect(mongoDB);
}

    
    
export async function getData() {
    if (!started) {
        console.dir('called this')
        await startDB();
    }
}



