import axios from 'axios'
import { mappingMediaType } from '../service/helper';
import { env } from '../utils/constants';
import { generateSignature } from '../utils/common';

export const uploadImage = async (file) => {
   try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append('upload_preset', 'my-uploads');
    const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/${mappingMediaType(file?.type?.split('/')[0] ?? 'image')}/upload`, formData)
    return data
   } catch (error) {
    console.error(error);
   }
}

export const destroyImage = async (publicId, asset = 'image') => {
    const { signature, timestamp } = generateSignature(publicId, env.CLOUD_SECRET_KEY)
    const formData = new FormData();
    formData.append('api_key', env.CLOUD_API_KEY);
    formData.append('public_id', publicId);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp);
    try {
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/${asset}/destroy`, formData);
      return data
    } catch (error) {
      console.error('Error deleting image:', error);
    }
}

