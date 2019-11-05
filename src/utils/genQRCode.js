import qrcode from 'qrcode';
import path from 'path';

export default text => {
  const filename = `${text}_${Date.now()}.png`;
  qrcode.toFile(
    path.join('./assets/qrcodes', filename),
    text,
    {
      margin: 2,
      errorCorrectionLevel: 'H',
    },
    err => {
      if (err) throw err;
    }
  );
  return `${process.env.BACKEND_URL}/qrcodes/${filename}`;
};
