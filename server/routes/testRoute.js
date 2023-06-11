import { Router } from 'express';
import fs, { existsSync, mkdirSync } from 'fs';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { base64, fileName } = req.body;
    console.log('1');

    if (!existsSync('testImageBase64')) {
      mkdirSync('./testImageBase64');
    }
    console.log('2');
    fs.writeFile(`./testImageBase64/${fileName}`, base64, { encoding: 'base64' }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('file created');
      }
    });
    res.status(200).json({ base64 });
  } catch (error) {
    res.status(500).json({ message: 'Somesing were wrong' });
  }
});

export default router;
