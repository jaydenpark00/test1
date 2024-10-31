let highestZIndex = 1;

document.querySelectorAll('.plant').forEach(plant => {
    plant.addEventListener('dragstart', dragStart);
    plant.addEventListener('dblclick', getHighest);
});

function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
}

const dropZone = document.querySelector('.jar-walls');
dropZone.addEventListener('dragover', dragOver);
dropZone.addEventListener('drop', drop);

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text");
    const draggedElement = document.getElementById(id);

    const dropZoneRect = dropZone.getBoundingClientRect();
    const offsetX = e.clientX - dropZoneRect.left - draggedElement.offsetWidth / 2;
    const offsetY = e.clientY - dropZoneRect.top - draggedElement.offsetHeight / 2;

    draggedElement.style.position = "absolute";
    draggedElement.style.left = `${offsetX}px`;
    draggedElement.style.top = `${offsetY}px`;

    dropZone.appendChild(draggedElement);
}

function getHighest(e) {
    highestZIndex++;
    e.target.style.zIndex = highestZIndex;
}
