import { StatusCodes } from "http-status-codes";
import Place from "../models/PlaceModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";
import User from "../models/userModel.js";

export const getPlaces = async (req, res) => {
  const queryObj = { owner: req.user.userId };

  if (req.user.role === "admin") {
    delete queryObj.owner;
  }
  const places = await Place.find(queryObj);

  res.status(StatusCodes.OK).json({ data: places });
};

export const getFavPlaces = async (req, res) => {
  const user = await User.findById(req.user.userId).populate({
    path: "myFavs",
    populate: { path: "reviews", select: "rating" },
  });

  res.status(StatusCodes.OK).json({ data: user.myFavs });
};

export const getAllPlaces = async (req, res) => {
  const { search, surroundingEnv, roomType, sort, priceMax, priceMin } =
    req.query;
  console.log(req.query);
  const queryObj = {};

  if (surroundingEnv && surroundingEnv !== "all") {
    queryObj.surroundingEnv = surroundingEnv;
  }

  if (roomType && roomType !== "all") {
    queryObj.roomType = roomType;
  }

  if (search) {
    let searchTerm = search;
    if (search[0] === "台") {
      searchTerm = "臺" + search.slice(1);
    }

    queryObj.$or = [
      { city: { $regex: searchTerm, $options: "i" } },
      { title: { $regex: searchTerm, $options: "i" } },
    ];
  }

  const sortObj = { costlyToCheapest: "-price", cheapestToCostly: "price" };
  const sortKey = sortObj[sort];

  //pagination logic
  const page = +req.query.page || 1;
  const limit = 8;
  const skip = (page - 1) * 8;

  const places = await Place.find(queryObj, {
    title: 1,
    photos: 1,
    price: 1,
    city: 1,
  })
    .populate({ path: "reviews", select: "rating" })
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  res.status(StatusCodes.OK).json({ data: places });
};

export const getPlaceById = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author", select: ["name", "nickName", "avatar"] },
    });

  if (!place) {
    throw new NotFoundError(`Can not find the job with ID:${id}`);
  }

  res.status(StatusCodes.OK).json({ data: place });
};

export const deletePlaceById = async (req, res) => {
  const { id } = req.params;

  const removePlace = await Place.findByIdAndDelete(id);

  if (!removePlace) {
    throw new NotFoundError(`Can not find the Place with ID:${id}`);
  }

  res.status(StatusCodes.OK).json({ msg: "place deleted" });
};

export const createPlace = async (req, res) => {
  req.body.owner = req.user.userId;

  if (req.files) {
    const promises = req.files.map((file) => {
      return cloudinary.v2.uploader
        .upload(file.path)
        .then((result) => {
          console.log("*** Success: Cloudinary Upload");
          return result;
        })
        .catch((err) => {
          console.log("*** Error: Cloudinary Upload");
        });
    });
    const data = await Promise.all(promises);

    const promisesForDelete = req.files.map((file) => {
      return fs
        .unlink(file.path)
        .then((result) => {
          console.log("*** Success: delete");
        })
        .catch((err) => {
          console.log("*** Error");
        });
    });
    await Promise.all(promisesForDelete);

    req.body.photos = data.map((photo) => {
      return photo.secure_url;
    });
    req.body.cloudinaryphotosId = data.map((photo) => {
      return photo.public_id;
    });
  }

  const newPlace = await Place.create(req.body);

  res.status(StatusCodes.CREATED).json({ data: newPlace });
};

export const editPlace = async (req, res) => {
  const { id } = req.params;

  if (req.files) {
    const promises = req.files.map((file) => {
      return cloudinary.v2.uploader
        .upload(file.path)
        .then((result) => {
          console.log("*** Success: Cloudinary Upload");
          return result;
        })
        .catch((err) => {
          console.log("*** Error: Cloudinary Upload");
        });
    });
    const data = await Promise.all(promises);

    const promisesForDelete = req.files.map((file) => {
      return fs
        .unlink(file.path)
        .then((result) => {
          console.log("*** Success: delete");
        })
        .catch((err) => {
          console.log("*** Error");
        });
    });
    await Promise.all(promisesForDelete);

    req.body.photos = data.map((photo) => {
      return photo.secure_url;
    });
    req.body.cloudinaryphotosId = data.map((photo) => {
      return photo.public_id;
    });
  }

  req.body.ogPhotos = req.body.ogPhotos.split(",");

  req.body.photos = [...req.body.photos, ...req.body.ogPhotos];

  const updatedPlace = await Place.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedPlace) {
    throw new NotFoundError(`Can not find the place with ID:${id}`);
  }

  res.status(StatusCodes.OK).json({ data: updatedPlace });
};
