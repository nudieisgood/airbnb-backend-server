import { StatusCodes } from "http-status-codes";
import Place from "../models/placeModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

export const getPlaces = async (req, res) => {
  const queryObj = { owner: req.user.userId };

  if (req.user.role === "admin") {
    delete queryObj.owner;
  }
  const place = await Place.find(queryObj);

  res.status(StatusCodes.OK).json({ data: place });
};

export const getAllPlaces = async (req, res) => {
  const places = await Place.find();

  res.status(StatusCodes.OK).json({ data: places });
};

export const getPlaceById = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);

  if (!place) {
    throw new NotFoundError(`Can not find the job with ID:${id}`);
  }

  res.status(StatusCodes.OK).json({ data: place });
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
  console.log(newPlace);
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

export const deletePlace = async (req, res) => {
  console.log("delete place");
  res.status(StatusCodes.OK).json({ place });
};
