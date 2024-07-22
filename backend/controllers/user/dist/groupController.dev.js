"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require("fs"),
    rename = _require.rename;

var _require2 = require("../../config/config"),
    WEBSITE_URL = _require2.WEBSITE_URL;

var _require3 = require("../../constants/events"),
    ALERT = _require3.ALERT,
    REFETCH_CHATS = _require3.REFETCH_CHATS,
    MESSAGE_ALERT = _require3.MESSAGE_ALERT;

var _require4 = require("../../lib/helper"),
    getOtherMember = _require4.getOtherMember;

var Chat = require("../../models/chatModel");

var Message = require("../../models/messageModel");

var User = require("../../models/userModel");

var AppError = require("../../services/AppError");

var _require5 = require("../../utils/features"),
    emitEvent = _require5.emitEvent;

var fs = require('fs').promises;

var groupController = {
  createGroup: function createGroup(req, res, next) {
    var _req$body, name, members, allMembers, group, data;

    return regeneratorRuntime.async(function createGroup$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(req.body);
            _req$body = req.body, name = _req$body.name, members = _req$body.members;

            if (!(!name || !members)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", next(new AppError(400, 'require name and member ')));

          case 4:
            allMembers = [].concat(_toConsumableArray(members), [req.user]);
            _context.next = 7;
            return regeneratorRuntime.awrap(Chat.create({
              name: name,
              isGroupChat: true,
              creator: req.user,
              members: allMembers
            }));

          case 7:
            group = _context.sent;
            data = {
              _id: group._id,
              name: group.name,
              isGroupChat: group.isGroupChat,
              creator: req.user,
              members: group.members
            };
            res.status(201).json({
              message: 'group created',
              data: data
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  getMyGroups: function getMyGroups(req, res, next) {
    var chats;
    return regeneratorRuntime.async(function getMyGroups$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(Chat.find({
              members: {
                $in: req.user
              },
              isGroupChat: true
            }).select("isGroupChat name avater members creator createdAt").populate('members', 'name avater imageurl'));

          case 2:
            chats = _context2.sent;
            res.status(200).json({
              message: 'Chats retrieved successfully',
              data: chats
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  deleteGroup: function deleteGroup(req, res, next) {
    var chatId, chat, messages;
    return regeneratorRuntime.async(function deleteGroup$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            chatId = req.body.chatId;
            _context4.next = 3;
            return regeneratorRuntime.awrap(Chat.findById(chatId));

          case 3:
            chat = _context4.sent;

            if (chat) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", next(new AppError(404, 'Chat not found')));

          case 6:
            if (!(!chat.isGroupChat && chat.creator.toString() !== req.user.toString())) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt("return", next(new AppError(403, 'Forbidden for this action')));

          case 8:
            _context4.next = 10;
            return regeneratorRuntime.awrap(Message.find({
              chat: chatId
            }));

          case 10:
            messages = _context4.sent;
            _context4.next = 13;
            return regeneratorRuntime.awrap(Promise.all(messages.map(function _callee(message) {
              var attachmentUrl;
              return regeneratorRuntime.async(function _callee$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      if (!message.attachment) {
                        _context3.next = 10;
                        break;
                      }

                      attachmentUrl = message.attachment.slice(WEBSITE_URL.length);
                      _context3.prev = 2;
                      _context3.next = 5;
                      return regeneratorRuntime.awrap(fs.unlink("./storage/".concat(attachmentUrl)));

                    case 5:
                      _context3.next = 10;
                      break;

                    case 7:
                      _context3.prev = 7;
                      _context3.t0 = _context3["catch"](2);
                      console.error("Failed to delete attachment: ".concat(_context3.t0));

                    case 10:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, null, null, [[2, 7]]);
            })));

          case 13:
            _context4.next = 15;
            return regeneratorRuntime.awrap(Promise.all([Message.deleteMany({
              chat: chatId
            }), chat.deleteOne()]));

          case 15:
            res.status(200).json({
              message: 'Group chat deleted successfully'
            });

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  renameChat: function renameChat(req, res, next) {
    var _req$body2, name, chatId, chat;

    return regeneratorRuntime.async(function renameChat$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$body2 = req.body, name = _req$body2.name, chatId = _req$body2.chatId;
            _context5.next = 3;
            return regeneratorRuntime.awrap(Chat.findById(chatId));

          case 3:
            chat = _context5.sent;

            if (chat) {
              _context5.next = 6;
              break;
            }

            return _context5.abrupt("return", next(new AppError(404, 'Chat not found')));

          case 6:
            if (!(!chat.isGroupChat || chat.creator.toString() !== req.user.toString())) {
              _context5.next = 8;
              break;
            }

            return _context5.abrupt("return", next(new AppError(403, 'Forbidden for this action')));

          case 8:
            chat.name = name;
            _context5.next = 11;
            return regeneratorRuntime.awrap(chat.save());

          case 11:
            emitEvent(req, MESSAGE_ALERT, chat.members, "Group name has changed to ".concat(name, "."));
            res.status(200).json({
              message: 'Group name has been changed successfully'
            });

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  getMyChats: function getMyChats(req, res, next) {
    var chats, transformChats;
    return regeneratorRuntime.async(function getMyChats$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return regeneratorRuntime.awrap(Chat.find({
              members: req.user
            }));

          case 2:
            chats = _context7.sent;
            _context7.next = 5;
            return regeneratorRuntime.awrap(Promise.all(chats.map(function _callee2(chat) {
              var otherMemberId, otherMember;
              return regeneratorRuntime.async(function _callee2$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      otherMemberId = getOtherMember(chat.members, req.user);
                      _context6.next = 3;
                      return regeneratorRuntime.awrap(User.findById(otherMemberId));

                    case 3:
                      otherMember = _context6.sent;
                      return _context6.abrupt("return", {
                        _id: chat._id,
                        isGroupChat: chat.isGroupChat,
                        imageurl: chat.isGroupChat ? chat.avatar : otherMember.imageurl,
                        name: chat.isGroupChat ? chat.name : otherMember.name,
                        members: chat.isGroupChat ? [otherMemberId] : otherMember._id
                      });

                    case 5:
                    case "end":
                      return _context6.stop();
                  }
                }
              });
            })));

          case 5:
            transformChats = _context7.sent;
            res.status(200).json({
              message: 'Chats retrieved successfully',
              data: transformChats || []
            });

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    });
  },
  addMembers: function addMembers(req, res, next) {
    var _chat$members;

    var id, members, chat, allNewMembersPromise, allNewMembers, uniqueNewMembers, allUserNames;
    return regeneratorRuntime.async(function addMembers$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            id = req.params.id;
            members = req.body.members;
            _context8.next = 4;
            return regeneratorRuntime.awrap(Chat.findById(id));

          case 4:
            chat = _context8.sent;

            if (chat) {
              _context8.next = 7;
              break;
            }

            return _context8.abrupt("return", next(new AppError(404, 'Chat not found')));

          case 7:
            if (!(!chat.isGroupChat || chat.creator.toString() !== req.user.toString())) {
              _context8.next = 9;
              break;
            }

            return _context8.abrupt("return", next(new AppError(403, 'Forbidden for this action')));

          case 9:
            allNewMembersPromise = members.map(function (member) {
              return User.findById(member, "name");
            });
            _context8.next = 12;
            return regeneratorRuntime.awrap(Promise.all(allNewMembersPromise));

          case 12:
            allNewMembers = _context8.sent;
            uniqueNewMembers = allNewMembers.filter(function (member) {
              return !chat.members.includes(member._id.toString());
            });

            (_chat$members = chat.members).push.apply(_chat$members, _toConsumableArray(uniqueNewMembers.map(function (member) {
              return member._id;
            })));

            if (!(chat.members.length > 100)) {
              _context8.next = 17;
              break;
            }

            return _context8.abrupt("return", next(new AppError(403, 'Member limit exceeded (maximum 100 members).')));

          case 17:
            _context8.next = 19;
            return regeneratorRuntime.awrap(chat.save());

          case 19:
            allUserNames = uniqueNewMembers.map(function (member) {
              return member.name;
            }).join(", ");
            emitEvent(req, ALERT, chat.members, "".concat(allUserNames, " added to the group."));
            emitEvent(req, REFETCH_CHATS, chat.members);
            return _context8.abrupt("return", res.status(200).json({
              message: 'Members added successfully.'
            }));

          case 23:
          case "end":
            return _context8.stop();
        }
      }
    });
  },
  removeMembers: function removeMembers(req, res, next) {
    var userId, id, _ref, _ref2, chat, user;

    return regeneratorRuntime.async(function removeMembers$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            userId = req.body.userId;
            id = req.params.id;
            _context9.next = 4;
            return regeneratorRuntime.awrap(Promise.all([Chat.findById(id), User.findById(userId, 'name')]));

          case 4:
            _ref = _context9.sent;
            _ref2 = _slicedToArray(_ref, 2);
            chat = _ref2[0];
            user = _ref2[1];

            if (!(!chat || !user)) {
              _context9.next = 10;
              break;
            }

            return _context9.abrupt("return", next(new AppError(400, 'please provide credentials')));

          case 10:
            // if (chat.members.length <= 3) {
            //      return next(new AppError(400,'Group have aleast 3 members'))            
            // }
            chat.members = chat.members.filter(function (member) {
              return member.toString() !== userId.toString();
            });
            _context9.next = 13;
            return regeneratorRuntime.awrap(chat.save());

          case 13:
            emitEvent(req, ALERT, chat.members, "".concat(user.name, " has been removed."));
            emitEvent(req, REFETCH_CHATS, chat.members);
            res.status(200).json({
              message: 'member removed'
            });

          case 16:
          case "end":
            return _context9.stop();
        }
      }
    });
  },
  leaveGroup: function leaveGroup(req, res, next) {
    var id, _ref3, _ref4, chat, user, randomNumber, newCreator;

    return regeneratorRuntime.async(function leaveGroup$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            id = req.params.id;
            _context10.next = 3;
            return regeneratorRuntime.awrap(Promise.all([Chat.findOn({
              _id: id,
              isGroupChat: true
            }), User.findById(req.user, 'name')]));

          case 3:
            _ref3 = _context10.sent;
            _ref4 = _slicedToArray(_ref3, 2);
            chat = _ref4[0];
            user = _ref4[1];

            if (!(!chat || !user)) {
              _context10.next = 9;
              break;
            }

            return _context10.abrupt("return", next(new AppError(400, 'please vlid provide credentials')));

          case 9:
            if (chat.members.includes(req.user)) {
              _context10.next = 11;
              break;
            }

            return _context10.abrupt("return", next(new AppError(401, 'you are not in group')));

          case 11:
            chat.members = chat.members.filter(function (member) {
              return member.toString() !== req.user.toString();
            });

            if (!(chat.creator.toString === req.user.toString)) {
              _context10.next = 21;
              break;
            }

            if (!(chat.members.length > 0)) {
              _context10.next = 19;
              break;
            }

            do {
              randomNumber = Math.floor(Math.random() * chat.members.length);
            } while (chat.members < 0);

            newCreator = chat.members[randomNumber];
            chat.creator = newCreator;
            _context10.next = 21;
            break;

          case 19:
            _context10.next = 21;
            return regeneratorRuntime.awrap(Promise.all([chat.deleteOne(), Message.deleteMany()]));

          case 21:
            _context10.next = 23;
            return regeneratorRuntime.awrap(chat.save());

          case 23:
            emitEvent(req, ALERT, chat.members, "".concat(user.name, " has left this group."));
            res.status(200).json({
              message: 'member left'
            });

          case 25:
          case "end":
            return _context10.stop();
        }
      }
    });
  }
};
module.exports = groupController;