import JobPost from "../../models/JobPost.js";
import { MAX_RECOMMENDATION_JOBS } from "../../constants.js";

/**
 * Retrieves jobs posted by companies in the same industry as the clicked job’s company.
 *
 * Steps: check the steps in the code too ^_^.
 *  1: Excludes the clicked job itself from the results.
 *  2: Joins with the "users" collection to get company details of the job posters.
 *  3: Filters jobs to only those where the posting company’s industry matches the clicked job’s industry.
 *  4: Selects relevant job fields and company info to return.
 *  5: Sorts the results by newest first.
 *  6: Limits the number of results to the specified limit  with default MAX_RECOMMENDATION_JOBS = 18.
 */
export const getIndustryMatchedJobs = async (
  clickedJob,
  limit = MAX_RECOMMENDATION_JOBS,
) => {
  return JobPost.aggregate([
    {
      $match: {
        $nor: [{ _id: clickedJob._id }, { isActive: false }],
      },
    },
    {
      $lookup: {
        // step 2
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedBy",
      },
    },
    { $unwind: "$postedBy" },
    {
      $match: {
        // step 3
        "postedBy.companyProfile.industry":
          clickedJob.postedBy.companyProfile.industry,
      },
    },
    {
      $project: {
        // step 4
        title: 1,
        tags: 1,
        location: 1,
        description: 1,
        isActive: 1,
        createdAt: 1,
        postedBy: {
          _id: 1,
          companyProfile: {
            companyName: "$postedBy.companyProfile.companyName",
            industry: "$postedBy.companyProfile.industry",
          },
        },
      },
    },
    { $sort: { createdAt: -1 } }, // step 5
    { $limit: limit }, // step 6
  ]);
};
