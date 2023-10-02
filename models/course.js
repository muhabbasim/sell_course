import { Schema, model, models } from "mongoose"

const courseSchema = new Schema({
  attachments: {
    type: Schema.Types.ObjectId,
    // ref: '', // refrence to the user
    default: null,
  },

  userId: {
    type: String
  },
  
  title: {
    type: String,
    required: true,
  },
  
  description: {
    type: String,
    default: '',
  },

  imageURl: {
    type: String,
    default: '',
  },

  price: {
    type: String,
    default: '',
  },

  isPublished: {
    type: Boolean,
    default: false,

  },

  categoryId: {
    type: String,
    default: '',
  },


}, {
  timestamps: true // for initialzation and update time
})


// check first if the user exists in the models before creating one 
const Course = models.course || model('course', courseSchema)
export default Course