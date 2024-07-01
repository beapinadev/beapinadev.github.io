document.addEventListener("DOMContentLoaded", () => {
    const inputElement = document.querySelector('.form input');
    const addButton = document.querySelector('.btn-add');
    const clearButton = document.querySelector('.btn-clear');
    const interessesList = document.querySelector('.lista ul');
    const newsElement = document.querySelector('.titulo-news'); 

    function loadInteresses() {
        interessesList.innerHTML = '';

        const interesses = localStorage.getItem('meus-interesses');
        
        if (interesses) {
            const interessesArray = JSON.parse(interesses);

            interessesArray.forEach(interesseObj => { 
                const li = document.createElement('li');
                li.className = interesseObj.completed ? 'completed' : '';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = interesseObj.completed;
                checkbox.addEventListener('change', () => toggleComplete(interesseObj.id));
                li.appendChild(checkbox);
                li.appendChild(document.createTextNode(interesseObj.text));
                interessesList.appendChild(li);
            });
        }
    }

    function addInteresses() {
        const interesse = inputElement.value.trim();
        if (interesse) {
            let interesses = localStorage.getItem('meus-interesses');
            interesses = interesses ? JSON.parse(interesses) : [];

            const newInteresse = {
                id: Date.now(),
                text: interesse,
                completed: false
            };

            interesses.push(newInteresse); 

            localStorage.setItem('meus-interesses', JSON.stringify(interesses));

            inputElement.value = '';

            loadInteresses();
        }
    }

    function toggleComplete(id) {
        let interesses = localStorage.getItem('meus-interesses');
        if (interesses) {
            interesses = JSON.parse(interesses);
            const interesse = interesses.find(interesse => interesse.id === id);
            if (interesse) {
                interesse.completed = !interesse.completed;
                localStorage.setItem('meus-interesses', JSON.stringify(interesses));
                loadInteresses();
            }
        }
    }

    function clearInteresses() {
        localStorage.removeItem('meus-interesses');
        loadInteresses();
    }

    function loadNews() {
        fetch('https://servicodados.ibge.gov.br/api/v3/noticias/?tipo=release')
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const firstNews = data.items[0];
                    newsElement.textContent = firstNews.titulo;
                } else {
                    newsElement.textContent = 'Nenhuma notícia encontrada.';
                }
            })
            .catch(error => {
                console.error('Erro ao carregar a notícia:', error);
                newsElement.textContent = 'Erro ao carregar a notícia.';
            });
    }

    addButton.addEventListener('click', addInteresses);
    clearButton.addEventListener('click', clearInteresses);

    loadInteresses();
    setInterval(loadInteresses, 1000);

    loadNews();
});
