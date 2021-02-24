const db = require("../models");
const Tutorial = db.tutorials;

// Tạo và lưu một khóa học lên CSDL
exports.create = (req, res) => {
  // Xác thực yêu cầu
  if (!req.body.title) {
    res.status(400).send({ message: "Nội dung không được để trống!" });
    return;
  }

  // Tạo một khóa học
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  });

  // lưu khóa học lên trên database
  tutorial
    .save(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Đã xảy ra một số lỗi khi tạo Khóa học.",
      });
    });
};

// Truy xuất tất cả khóa học từ CSDL
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Tutorial.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Đã xảy ra một số lỗi khi tìm kiếm Khóa học.",
      });
    });
};

// Tìm một khóa học bằng ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "Không tìm thấy khóa học với id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Lỗi khi tìm kiếm khóa học với id=" + id });
    });
};

// Cập nhật khóa học bằng id trong yêu cầu
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Dữ liệu cập nhật không được để trống!",
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Không thể cập nhật khóa học với id=${id}.`,
        });
      } else res.send({ message: "Khóa học đã được cập nhật thành công!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Lỗi cập nhật khóa học với id=" + id,
      });
    });
};

// Xóa khóa học bằng id
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Không thể xóa khóa học với id=${id}.`,
        });
      } else {
        res.send({
          message: "Khóa học đã xóa thành công!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Không thể xóa khóa học với id=" + id,
      });
    });
};

// Xóa tất cả khóa học từ CSDL
exports.deleteAll = (req, res) => {
  Tutorial.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Tất cả khóa học đã được xóa thành công!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Đã xảy ra một số lỗi khi xóa tất cả các khóa học.",
      });
    });
};

// Tìm tất cả các khóa học đã xuất bản
exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Đã xảy ra một số lỗi khi tìm kiếm khóa học đã xuất bản.",
      });
    });
};
