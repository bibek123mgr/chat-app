"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require("../../config/config.js"),
    WEBSITE_URL = _require.WEBSITE_URL;

var _require2 = require('../../lib/helper.js'),
    getOtherMember = _require2.getOtherMember;

var Chat = require("../../models/chatModel.js");

var Message = require("../../models/messageModel.js");

var Request = require("../../models/requestModel.js");

var User = require("../../models/userModel.js");

var AppError = require("../../services/AppError.js");

var fs = require("fs");

var userController = {
  getMyFriends: function getMyFriends(req, res, next) {
    var chats, friends, friendIds, query, myFriends;
    return regeneratorRuntime.async(function getMyFriends$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(Chat.find({
              members: {
                $in: [req.user]
              }
            }).exec());

          case 2:
            chats = _context.sent;
            friends = chats.flatMap(function (chat) {
              return chat.members.filter(function (member) {
                return !member.equals(req.user);
              });
            });
            friendIds = friends.map(function (friend) {
              return friend._id;
            });
            query = {
              _id: {
                $in: friendIds
              }
            };
            _context.next = 8;
            return regeneratorRuntime.awrap(User.find(query).select('name imageurl').exec());

          case 8:
            myFriends = _context.sent;
            return _context.abrupt("return", res.status(200).json({
              message: 'Fetched successfully',
              data: myFriends
            }));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  findUser: function findUser(req, res, next) {
    var _req$query, _req$query$name, name, _req$query$limit, limit, _req$query$page, page, skip, chats, friends, queryCriteria, remainingUsers, totalPages;

    return regeneratorRuntime.async(function findUser$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$query = req.query, _req$query$name = _req$query.name, name = _req$query$name === void 0 ? '' : _req$query$name, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page;
            skip = (page - 1) * limit;
            _context2.next = 4;
            return regeneratorRuntime.awrap(Chat.find({
              members: {
                $in: [req.user]
              }
            }).exec());

          case 4:
            chats = _context2.sent;
            friends = chats.map(function (chat) {
              return getOtherMember(chat.members, req.user);
            });
            friends.push(req.user.toString());
            queryCriteria = {
              _id: {
                $nin: friends
              }
            };

            if (name) {
              queryCriteria.name = {
                $regex: name,
                $options: 'i'
              };
            }

            _context2.next = 11;
            return regeneratorRuntime.awrap(User.find(queryCriteria).select('name imageurl').limit(Number(limit)).skip(Number(skip)).exec());

          case 11:
            remainingUsers = _context2.sent;
            totalPages = Math.ceil(remainingUsers.length / limit) || 0;
            return _context2.abrupt("return", res.status(200).json({
              message: 'fetch successfully',
              data: remainingUsers,
              totalPages: totalPages
            }));

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  unfriend: function unfriend(req, res, next) {
    var userId, _ref, _ref2, chat, messages;

    return regeneratorRuntime.async(function unfriend$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userId = req.body.userId;
            console.log(userId);
            _context3.next = 4;
            return regeneratorRuntime.awrap(Promise.all([Chat.findOne({
              isGroupChat: false,
              members: {
                $in: [req.user, userId]
              }
            }), Message.find({
              chat: id
            })]));

          case 4:
            _ref = _context3.sent;
            _ref2 = _slicedToArray(_ref, 2);
            chat = _ref2[0];
            messages = _ref2[1];

            if (chat) {
              _context3.next = 10;
              break;
            }

            return _context3.abrupt("return", next(new AppError(400, 'You are not a friend')));

          case 10:
            messages.forEach(function (_ref3) {
              var attachment = _ref3.attachment;

              if (attachment) {
                var attachmentUrl = attachment.slice(WEBSITE_URL.length);
                fs.unlink("./storage/".concat(attachmentUrl), function (err) {
                  if (err) console.error("Error deleting file: ".concat(attachmentUrl), err);
                });
              }
            });
            _context3.next = 13;
            return regeneratorRuntime.awrap(chat.deleteOne());

          case 13:
            // await Message.deleteMany({ chat: id });
            res.status(200).json({
              message: 'Successfully unfriended'
            });

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  editProfile: function editProfile(req, res, next) {
    var _req$body, name, email, fileName, user;

    return regeneratorRuntime.async(function editProfile$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$body = req.body, name = _req$body.name, email = _req$body.email;

            if (req.file) {
              fileName = WEBSITE_URL + req.file.filename;
            }

            _context4.next = 4;
            return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user, {
              name: name,
              email: email,
              imageurl: fileName
            }, {
              "new": true
            }).select("name email imageurl role createdAt"));

          case 4:
            user = _context4.sent;
            res.status(200).json({
              message: 'profile updated successfully',
              data: user
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  deleteMyAccount: function deleteMyAccount(req, res, next) {
    var password, _ref4, _ref5, user, chats, chatts, isMatch, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, chat, newCreatorIndex, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _chat, options;

    return regeneratorRuntime.async(function deleteMyAccount$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            password = req.body.password;
            _context5.next = 3;
            return regeneratorRuntime.awrap(Promise.all([User.findById(req.user).select("password"), Chat.find({
              members: {
                $in: [req.user]
              },
              isGroupChat: true
            }), Chat.find({
              members: {
                $in: [req.user]
              },
              isGroupChat: false
            })]));

          case 3:
            _ref4 = _context5.sent;
            _ref5 = _slicedToArray(_ref4, 3);
            user = _ref5[0];
            chats = _ref5[1];
            chatts = _ref5[2];
            _context5.next = 10;
            return regeneratorRuntime.awrap(user.matchPassword(password));

          case 10:
            isMatch = _context5.sent;

            if (isMatch) {
              _context5.next = 13;
              break;
            }

            return _context5.abrupt("return", next(new AppError(404, 'Enter valid credentials')));

          case 13:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context5.prev = 16;
            _iterator = chats[Symbol.iterator]();

          case 18:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context5.next = 38;
              break;
            }

            chat = _step.value;
            chat.members = chat.members.filter(function (member) {
              return member.toString() !== req.user.toString();
            });

            if (!(chat.creator.toString() === req.user.toString())) {
              _context5.next = 33;
              break;
            }

            if (!(chat.members.length > 0)) {
              _context5.next = 28;
              break;
            }

            newCreatorIndex = void 0;

            do {
              newCreatorIndex = Math.floor(Math.random() * chat.members.length);
            } while (newCreatorIndex < 0);

            chat.creator = chat.members[newCreatorIndex];
            _context5.next = 33;
            break;

          case 28:
            _context5.next = 30;
            return regeneratorRuntime.awrap(Chat.deleteOne({
              _id: chat._id
            }));

          case 30:
            _context5.next = 32;
            return regeneratorRuntime.awrap(Message.deleteMany({
              chat: chat._id
            }));

          case 32:
            return _context5.abrupt("continue", 35);

          case 33:
            _context5.next = 35;
            return regeneratorRuntime.awrap(chat.save());

          case 35:
            _iteratorNormalCompletion = true;
            _context5.next = 18;
            break;

          case 38:
            _context5.next = 44;
            break;

          case 40:
            _context5.prev = 40;
            _context5.t0 = _context5["catch"](16);
            _didIteratorError = true;
            _iteratorError = _context5.t0;

          case 44:
            _context5.prev = 44;
            _context5.prev = 45;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 47:
            _context5.prev = 47;

            if (!_didIteratorError) {
              _context5.next = 50;
              break;
            }

            throw _iteratorError;

          case 50:
            return _context5.finish(47);

          case 51:
            return _context5.finish(44);

          case 52:
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context5.prev = 55;
            _iterator2 = chatts[Symbol.iterator]();

          case 57:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context5.next = 68;
              break;
            }

            _chat = _step2.value;
            _chat.members = _chat.members.filter(function (member) {
              return member.toString() !== req.user.toString();
            });

            if (!(_chat.members.length < 0)) {
              _context5.next = 65;
              break;
            }

            _context5.next = 63;
            return regeneratorRuntime.awrap(Chat.deleteOne({
              _id: _chat._id
            }));

          case 63:
            _context5.next = 65;
            return regeneratorRuntime.awrap(Message.deleteMany({
              chat: _chat._id
            }));

          case 65:
            _iteratorNormalCompletion2 = true;
            _context5.next = 57;
            break;

          case 68:
            _context5.next = 74;
            break;

          case 70:
            _context5.prev = 70;
            _context5.t1 = _context5["catch"](55);
            _didIteratorError2 = true;
            _iteratorError2 = _context5.t1;

          case 74:
            _context5.prev = 74;
            _context5.prev = 75;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 77:
            _context5.prev = 77;

            if (!_didIteratorError2) {
              _context5.next = 80;
              break;
            }

            throw _iteratorError2;

          case 80:
            return _context5.finish(77);

          case 81:
            return _context5.finish(74);

          case 82:
            _context5.next = 84;
            return regeneratorRuntime.awrap(user.deleteOne());

          case 84:
            options = {
              expires: new Date(Date.now()),
              httpOnly: true,
              secure: true
            };
            res.status(200).cookie("token", null, options).json({
              message: 'Successfully account deleted'
            });

          case 86:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[16, 40, 44, 52], [45,, 47, 51], [55, 70, 74, 82], [75,, 77, 81]]);
  },
  getMyProfile: function getMyProfile(req, res, next) {
    var _ref6, _ref7, user, friends, groups, data;

    return regeneratorRuntime.async(function getMyProfile$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return regeneratorRuntime.awrap(Promise.all([User.findById(req.user), Chat.countDocuments({
              members: {
                $in: [req.user]
              },
              isGroupChat: false
            }), Chat.countDocuments({
              members: {
                $in: [req.user]
              },
              isGroupChat: true
            })]));

          case 2:
            _ref6 = _context6.sent;
            _ref7 = _slicedToArray(_ref6, 3);
            user = _ref7[0];
            friends = _ref7[1];
            groups = _ref7[2];
            data = {
              _id: user._id,
              name: user.name,
              email: user.email,
              imageurl: user.imageurl,
              createdAt: user.createdAt,
              role: user.role,
              friends: friends,
              groups: groups
            };
            res.status(200).json({
              message: 'fetch profile',
              data: data
            });

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  changePassword: function changePassword(req, res, next) {
    var _req$body2, password, newPassword, user, isMatch, options, token;

    return regeneratorRuntime.async(function changePassword$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _req$body2 = req.body, password = _req$body2.password, newPassword = _req$body2.newPassword;
            _context7.next = 3;
            return regeneratorRuntime.awrap(User.findById(req.user).select("password"));

          case 3:
            user = _context7.sent;
            _context7.next = 6;
            return regeneratorRuntime.awrap(user.matchPassword(password));

          case 6:
            isMatch = _context7.sent;

            if (isMatch) {
              _context7.next = 9;
              break;
            }

            return _context7.abrupt("return", next(new AppError(404, 'enter valid credentails')));

          case 9:
            user.password = newPassword;
            _context7.next = 12;
            return regeneratorRuntime.awrap(user.save());

          case 12:
            options = {
              expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
              httpOnly: true,
              secure: true
            };
            token = user.generateToken();
            res.status(200).cookie("token", token, options).json({
              message: 'password changed'
            });

          case 15:
          case "end":
            return _context7.stop();
        }
      }
    });
  }
};
module.exports = userController;