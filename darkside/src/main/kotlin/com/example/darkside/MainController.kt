package com.example.darkside

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import javax.persistence.*

@RestController
class RoomController(val service: RoomService) {
    @GetMapping("/all_rooms")
    fun rooms(): List<Room> = service.getRoomsList()

    @PostMapping("/get_room")
    fun getRoom(@RequestBody input: Map<String, Int>): Room? = input["id"]?.let { service.findRoom(it) }

    @PostMapping("/room_requestors")
    fun getRequestors(@RequestBody input: Map<String, Int>): List<Int>? = input["id"]?.let { service.findRequestors(it) }

    @PostMapping("/edit_room_info")
    fun editInfo(@RequestBody input: Map<String, String>) {
        input["room_id"]?.let { input["new_info"]?.let { it1 -> service.editInfo(it.toInt(), it1) } }
    }

    @PostMapping("/edit_room_name")
    fun editName(@RequestBody input: Map<String, String>) {
        input["room_id"]?.let { input["new_name"]?.let { it1 -> service.editName(it.toInt(), it1) } }
    }

    @PostMapping("/edit_room_rate")
    fun editRate(@RequestBody input: Map<String, String>) {
        input["room_id"]?.let { input["new_rate"]?.let { it1 -> service.editRate(it.toInt(), it1.toInt()) } }
    }

    @PostMapping("/dorm_rooms")
    fun userMessages(@RequestBody dormId: Int): List<Room> = service.getDormRooms(dormId)

    @PostMapping("/add_room")
    fun addRoom(@RequestBody room: Room) { service.addRoom(room) }
}

@RestController
class UserController(val service: UserService) {
    @PostMapping("/get_user")
    fun user(@RequestBody input: Map<String, Int>): User? = input["id"]?.let { service.findUser(it) }

    @PostMapping("/add_user")
    fun addRoom(@RequestBody user: User) { service.addUser(user) }
}

@RestController
class MessageController(val service: MessageService) {
    @GetMapping("/all_messages")
    fun messages(): List<Message> = service.getMessagesList()

    @PostMapping("/user_messages")
    fun userMessages(@RequestBody userId: Int): List<Message> = service.getUserMessagesList(userId)

    @PostMapping("/dialog_messages")
    fun dialogMessages(@RequestBody data: Map<String, Int>): List<Message>? =
        data["user"]?.let { data["room"]?.let { it1 -> service.getDialogMessagesList(it, it1) } }

    @PostMapping("/add_message")
    fun addRoom(@RequestBody message: Message) { service.addMessage(message) }
}

@RestController
class DormController(val service: DormService) {
    @GetMapping("/all_dorms")
    fun dorms(): List<Dorm> = service.getDorms()

    @PostMapping("/add_dorm")
    fun addDorm(@RequestBody dorm: Dorm) { service.addDorm(dorm) }
}

@RestController
class LikesController(val service: LikeService) {
    @PostMapping("/connect")
    fun like(@RequestBody input: Like) {
        service.like(input)
    }

    @PostMapping("/disconnect")
    fun unlike(@RequestBody input: Like) {
        service.unlike(input)
    }

    @PostMapping("/are_connected")
    fun liked(@RequestBody input: Map<String, Int>): Int? = input["userid"]?.let { input["roomid"]?.let { it1 ->
        service.isLiked(it,
            it1
        )
    } }
}

@Table(name="ROOMS")
@Entity
data class Room(@Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Int?, var number: String, var name: String, var description: String, var rate: Int, var dorm: Int, var ava: String) {
}

@Table(name="USERS")
@Entity
data class User(@Id var vkid: Int?, var dorm: Int, var room: Int, var firstname: String, var lastname: String, var ava: String) {
}

@Table(name="MESSAGES")
@Entity
data class Message(@Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Int?, var content: String, var source: Int, var destination: Int, val direction: Int) {
}

@Table(name="DORMS")
@Entity
data class Dorm(@Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Int?, var name: String, var description: String) {
}

@Table(name="LIKES")
@Entity
data class Like(@Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Int?, var userid: Int, var roomid: Int) {
}
