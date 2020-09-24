const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Workload = require('../../models/Workload');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    GET api/workloads
// @desc     Get workloads
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const workload = await Workload.find({ user: req.user.id });

    if (!workload) {
      return res.status(404).json({ msg: 'Workload not found' });
    }
    res.json(workload);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

module.exports = router;
