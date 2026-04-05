const router = require('express').Router();
const { auth, adminAuth } = require('../middleware/auth');
const { uploadStamp } = require('../middleware/upload');
const {
  getOverview,
  getAdminPostcards,
  createAdminPostcard,
  updateAdminPostcard,
  deleteAdminPostcard,
  getStampSeries,
  createStampSeries,
  updateStampSeries,
  deleteStampSeries,
  getAdminStamps,
  createAdminStamp,
  updateAdminStamp,
  deleteAdminStamp,
  uploadAdminStampImage,
  getActivationCodes,
  generateActivationCodes,
  deleteActivationCode,
  getPendingPostcards,
  approvePostcard,
  rejectPostcard,
} = require('../controllers/adminController');

router.use(auth, adminAuth);

router.get('/overview', getOverview);

router.get('/postcards', getAdminPostcards);
router.post('/postcards', createAdminPostcard);
router.put('/postcards/:id', updateAdminPostcard);
router.delete('/postcards/:id', deleteAdminPostcard);

router.get('/stamp-series', getStampSeries);
router.post('/stamp-series', createStampSeries);
router.put('/stamp-series/:id', updateStampSeries);
router.delete('/stamp-series/:id', deleteStampSeries);

router.get('/stamps', getAdminStamps);
router.post('/stamps', createAdminStamp);
router.put('/stamps/:id', updateAdminStamp);
router.delete('/stamps/:id', deleteAdminStamp);
router.post('/stamps/upload-image', uploadStamp.single('image'), uploadAdminStampImage);

router.get('/activation-codes', getActivationCodes);
router.post('/activation-codes/generate', generateActivationCodes);
router.delete('/activation-codes/:id', deleteActivationCode);

router.get('/audit/pending', getPendingPostcards);
router.post('/audit/:id/approve', approvePostcard);
router.post('/audit/:id/reject', rejectPostcard);

module.exports = router;
