const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const Qs = require('qs');
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = ` ${message.username} ${message.time} ${message.text} `;
    document.querySelector('.chat-messages').appendChild(div);
};

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => ` ${user.username} `).join('')}
    `;
}

// dijkstra's algorithm please
const dijkstra = (graph, source) => {
    const dist = {};
    for (let node in graph) {
        dist[node] = Infinity;
    }
    dist[source] = 0;

    const unvisited = new Set(Object.keys(graph));
    const previous = {};

    while (unvisited.size > 0) {
        const currNode = minDistanceNode(unvisited, dist);
        unvisited.delete(currNode);

        for (let neighbor in graph[currNode]) {
            const distance = graph[currNode][neighbor];
            if (distance + dist[currNode] < dist[neighbor]) {
                dist[neighbor] = distance + dist[currNode];
                previous[neighbor] = currNode;
            }
        }
    }
    return [dist, previous];
}

const minDistanceNode = (nodes, dist) => {
    return Array.from(nodes).reduce((min, node) => dist[node] < dist[min] ? node : min);
}

const path = (previous, end) => {
    const nodes = [end];
    while (previous[end]) {
        nodes.push(previous[end]);
        end = previous[end];
    }
    return nodes.reverse();
}

const graph = {
    start: { A: 5, B: 2 },
    A: { C: 4, D: 2 },
    B: { A: 8, D: 7 },
    C: { D: 6, finish: 3 },
    D: { finish: 1 },
    finish: {}
};

const [dist, previous] = dijkstra(graph, 'start');
console.log(dist);