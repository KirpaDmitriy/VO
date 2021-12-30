package com.example.darkside

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
interface RoomRepository : CrudRepository<Room, String> {
    @Query("SELECT * FROM ROOMS", nativeQuery = true)
    fun allRooms(): List<Room>

    @Query("SELECT * FROM ROOMS WHERE ID=?1", nativeQuery = true)
    fun findRoom(roomId: Int): Room

    @Query("SELECT DISTINCT(SOURCE) FROM MESSAGES WHERE DESTINATION=?1 AND DIRECTION=0", nativeQuery = true)
    fun findRequestors(roomId: Int): List<Int>

    @Transactional
    @Modifying
    @Query("UPDATE ROOMS SET DESCRIPTION=?2 WHERE ID=?1", nativeQuery = true)
    fun editInfo(roomId: Int, newInfo: String)

    @Transactional
    @Modifying
    @Query("UPDATE ROOMS SET NAME=?2 WHERE ID=?1", nativeQuery = true)
    fun editName(roomId: Int, newName: String)

    @Transactional
    @Modifying
    @Query("UPDATE ROOMS SET RATE=?2 WHERE ID=?1", nativeQuery = true)
    fun editRate(roomId: Int, newRate: Int)

    @Query("SELECT * FROM ROOMS WHERE DORM=?1", nativeQuery = true)
    fun dormRooms(dormId: Int): List<Room>
}

@Repository
interface UserRepository : CrudRepository<User, String> {
    fun getByVkid(Vkid: Int): User
}

@Repository
interface MessageRepository : CrudRepository<Message, String> {
    @Query("SELECT * FROM MESSAGES", nativeQuery = true)
    fun allMessages(): List<Message>

    @Query("SELECT * FROM MESSAGES WHERE (SOURCE = ?1 AND DIRECTION = 0) OR (DESTINATION = ?1 AND DIRECTION = 1)", nativeQuery = true)
    fun getUserMessages(source: Int): List<Message>

    @Query("SELECT * FROM MESSAGES WHERE ((SOURCE = ?1) AND (DESTINATION = ?2) AND (DIRECTION = 0)) OR ((SOURCE = ?2) AND (DESTINATION = ?1) AND (DIRECTION = 1))", nativeQuery = true)
    fun getDialogMessages(user: Int, room: Int): List<Message>
}

@Repository
interface DormRepository : CrudRepository<Dorm, String> {
    @Query("SELECT * FROM DORMS", nativeQuery = true)
    fun allDorms(): List<Dorm>
}

@Repository
interface LikeRepository : CrudRepository<Like, String> {
    @Query("SELECT COUNT(*) FROM LIKES WHERE USERID=?1 AND ROOMID=?2", nativeQuery = true)
    fun isLiked(user: Int, room: Int): Int

    @Transactional
    @Modifying
    fun deleteLikeByUseridAndRoomid(user: Int, room: Int): Int
}