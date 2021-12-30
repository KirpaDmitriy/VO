package com.example.darkside

import org.springframework.stereotype.Service

@Service
class RoomService(val bd: RoomRepository) {
    fun getRoomsList(): List<Room> = bd.allRooms()

    fun findRoom(roomId: Int): Room = bd.findRoom(roomId)

    fun findRequestors(roomId: Int): List<Int> = bd.findRequestors(roomId)

    fun editInfo(roomId: Int, newInfo: String) {
        bd.editInfo(roomId, newInfo)
    }

    fun editName(roomId: Int, newName: String) {
        bd.editName(roomId, newName)
    }

    fun editRate(roomId: Int, newRate: Int) {
        bd.editRate(roomId, newRate)
    }

    fun getDormRooms(dormId: Int): List<Room> = bd.dormRooms(dormId)

    fun addRoom(room: Room) {
        bd.save(room)
    }
}

@Service
class UserService(val bd: UserRepository) {
    fun addUser(user: User) {
        bd.save(user)
    }

    fun findUser(id: Int): User = bd.getByVkid(id)
}

@Service
class MessageService(val bd: MessageRepository) {
    fun getMessagesList(): List<Message> = bd.allMessages()

    fun getUserMessagesList(userId: Int): List<Message> = bd.getUserMessages(userId)

    fun getDialogMessagesList(userId: Int, roomId: Int): List<Message> = bd.getDialogMessages(userId, roomId)

    fun addMessage(message: Message) {
        bd.save(message)
    }
}

@Service
class DormService(val bd: DormRepository) {
    fun getDorms(): List<Dorm> = bd.allDorms()

    fun addDorm(dorm: Dorm) {
        bd.save(dorm)
    }
}

@Service
class LikeService(val bd: LikeRepository) {
    fun like(newLike: Like) {
        bd.save(newLike)
    }

    fun unlike(oldLike: Like) {
        bd.deleteLikeByUseridAndRoomid(oldLike.userid, oldLike.roomid)
    }

    fun isLiked(user: Int, room: Int): Int = bd.isLiked(user, room)
}