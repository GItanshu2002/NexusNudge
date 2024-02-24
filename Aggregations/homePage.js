// geoNear is allways required to be the first one on the aggrigation calling
const geoNear = async (payload, user) => {
  try {
    return {
      // it is used to sort and fikter the user distance wise
      $geoNear: {
        //  if only geting cordinates form front end change "payload.location" to {type: "Point",coordinates: payload.location},
        near: payload.location || {
          type: "Point",
          coordinates: user.location.coordinates,
        }, // get cords from db
        distanceField: "distance.calculated", // calculate the distance form coordinates in a new veriable distance
        maxDistance: payload.maxDistance || 5000,
        spherical: true,
      },
    };
  } catch (err) {
    throw err;
  }
}; // ref: https://www.mongodb.com/docs/manual/reference/operator/aggregation/geoNear/#examples

const matchStage = async (payload, user) => {
  try {
    return {
      $match: {
        isDeleted: payload.isDeleted,
        _id: { $ne: user._id }, // Filter out the current user
        gender: payload.show_me || user.interestedIn, // will show only those genders who user wants to see
        interestedIn: user.gender, // will show only those who wants to see user's gender
        dob: { $gte: payload.minAge, $lte: payload.maxAge },
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookupStage = async (userData) => {
  try {
    return {
      $lookup: {
        from: "like_dislikes", // model
        let: { my_id: userData._id, other_id: "$_id" }, // _id of user model
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  // only those who are liked or disliked by current user
                  { $eq: ["$liked_by", "$$my_id"] }, // current user
                  { $eq: ["$liked_to", "$$other_id"] }, // user to check
                ],
              },
            },
          },
        ],
        as: "liked_disliked", // veriable
      },
    };
  } catch (err) {
    throw err;
  }
};

const unwind_data = async () => {
  try {
    return {
      $unwind: {
        path: "$liked_disliked", // veriable from lookup
        preserveNullAndEmptyArrays: true, // to keep the array is null from above lookup
      },
    };
  } catch (err) {
    throw err;
  }
};

const groupStage = async () => {
  try {
    return (
      // {
      //   $addFields: {
      //     roundedDistance: { $round: ["$distance", 1] }, // Round the distance to 2 decimal places
      //   },
      // },
      {
        // get all the data to show in the home page
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          city: { $first: "$city" },
          gender: { $first: "$gender" },
          interestedIn: { $first: "$interestedIn" },
          bio: { $first: "$bio" },
          sexualOrientation: { $first: "$sexualOrientation" },
          liked_disliked: { $first: "$liked_disliked" },
          distance: { $first: "$distance" },
        },
      }
    );
  } catch (err) {
    throw err;
  }
};

const redctStage = async (userData) => {
  try {
    return {
      $redact: {
        $cond: {
          if: {
            $eq: ["$liked_disliked", null], // liked_disliked will be null for those whose profile is yet to be liked or disliked
          },
          then: "$$KEEP", // will keep the one satesifing above condition
          else: "$$PRUNE", // will remove the one satesifing above condition from groupStage array
        },
      },
    };
  } catch (err) {
    throw err;
  }
};

const projectStage = async () => {
  try {
    return {
      $project: {
        _id: 1,
        name: 1,
        city: 1,
        gender: 1,
        interestedIn: 1,
        bio: 1,
        distance: 1,
      },
    };
  } catch (err) {
    throw err;
  }
};

const sort_data = async () => {
  try {
    return {
      $sort: { distance: 1 },
    };
  } catch (err) {
    throw err;
  }
};
// Define the pipeline combining all stages
module.exports = {
  matchStage,
  lookupStage,
  unwind_data,
  geoNear,
  groupStage,
  redctStage,
  projectStage,
  sort_data,
};
