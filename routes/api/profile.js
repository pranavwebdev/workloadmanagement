const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
const checkObjectId = require('../../middleware/checkObjectId');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Workload = require('../../models/Workload');

const startOfWeek = (date) => {
  let firstday = date.getDate() - date.getDay();
  return new Date(date.setDate(firstday));
};

const endOfWeek = (date) => {
  let lastday = date.getDate() - date.getDay() + 4;
  return new Date(date.setDate(lastday));
};

const nextWeekStart = (date) => {
  let nextWeekFirstday = date.getDate() + 3;
  return new Date(date.setDate(nextWeekFirstday));
};

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('firstname', 'First Name is required').not().isEmpty(),
      check('lastname', 'Last Name is required').not().isEmpty(),
      check('dateofbirth', 'Date of Birth is required').not().isEmpty(),
      check('address', 'Address is required').not().isEmpty(),
      check('phone', 'Phone is required').not().isEmpty(),
      check('city', 'City is required').not().isEmpty(),
      check('employer', 'Employer is required').not().isEmpty(),
      check('payrate', 'Pay Rate is required').not().isEmpty(),
      check(
        'contractstartdate',
        'Contract Start Date is required and needs to be before the Last Date'
      )
        .not()
        .isEmpty()
        .custom((value, { req }) =>
          req.body.contractlastdate ? value < req.body.contractlastdate : true
        ),
      check(
        'contractlastdate',
        'Contract Last Date is required and needs to be after the Start Date'
      )
        .not()
        .isEmpty()
        .custom((value, { req }) =>
          req.body.contractstartdate ? value > req.body.contractstartdate : true
        )
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      firstname,
      lastname,
      dateofbirth,
      address,
      phone,
      city,
      employer,
      payrate,
      contractstartdate,
      contractlastdate
    } = req.body;

    const profileFields = {
      user: req.user.id,
      firstname,
      lastname,
      dateofbirth,
      address,
      phone,
      city,
      employer,
      payrate,
      contractstartdate,
      contractlastdate
    };

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      // Remove user workloads
      await Workload.deleteMany({ user: req.user.id });

      // Create or update (after delete) user workloads
      let generateWeek = true;
      let generateLastWeek = false;

      let userContractStartDate = new Date(req.body.contractstartdate);
      let userContractLastDate = new Date(req.body.contractlastdate);

      const firststartdate = new Date(req.body.contractstartdate);
      let weekstartdate, weeklastdate;
      let i = 0;

      weeklastdate = endOfWeek(userContractStartDate);
      if (weeklastdate >= userContractLastDate) {
        weeklastdate = userContractLastDate;
        generateLastWeek = true;
      }

      while (generateWeek) {
        i++;
        weekname = `Week ${i}`;

        const newWorkload = new Workload({
          user: req.user.id,
          weekname: weekname,
          weekstartdate: i == 1 ? firststartdate : weekstartdate,
          weeklastdate: weeklastdate
        });

        const workload = await newWorkload.save();

        if (generateLastWeek) {
          break;
        } else {
          weekstartdate = nextWeekStart(weeklastdate);
          weeklastdate = endOfWeek(startOfWeek(weekstartdate));

          if (weeklastdate >= userContractLastDate) {
            weeklastdate = userContractLastDate;
            generateLastWeek = true;
          }
        }
      }

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
