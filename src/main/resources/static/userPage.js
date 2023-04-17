const data = document.getElementById("tableUserBody");
const url = 'http://localhost:8080/api/user/viewUser';
const panel = document.getElementById("user-header");

function userAuthInfo() {
    fetch(url)
        .then((res) => res.json())
        .then((user) => {

            let temp = '';

            temp += `<tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.username}</td>
            <td>${user.roles.map(role => " " + role.role.substring(5))}</td>
            </tr>`;
            data.innerHTML = temp;
            panel.innerHTML = `<h5>${user.username} with roles: ${user.roles.map(role => " " + role.role.substring(5))}</h5>`
        });
}

userAuthInfo()

