let modalQtd = 0
let carrinho = []
let modalChave = 0

const c = (elemento) => document.querySelector(elemento)
const cs = (elemento) => document.querySelectorAll(elemento)


pizzaJson.map((pizza, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true)

    pizzaItem.setAttribute('data-key', index)

    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description
    
    pizzaItem.querySelector('a').addEventListener('click', (evento) => {
        evento.preventDefault()

        let chave = evento.target.closest('.pizza-item').getAttribute('data-key')
        modalQtd = 1
        modalChave = chave

        c('.pizzaInfo h1').innerHTML = pizzaJson[chave].name
        c('.pizzaInfo--desc').innerHTML = pizzaJson[chave].description
        c('.pizzaBig img').innerHTML = pizzaJson[chave].img
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[chave].price.toFixed(2)}`

        c('.pizzaInfo--size.selected').classList.remove('selected')

        cs('.pizzaInfo--size').forEach((tamanho, tamanhoIndex) => {
            if(tamanhoIndex == 2) {
                tamanho.classList.add('selected')
            }
            tamanho.querySelector('span').innerHTML = pizzaJson[chave].sizes[tamanhoIndex]
        })

        c('.pizzaInfo--qt').innerHTML = modalQtd

        c('.pizzaWindowArea').style.opacity = 0
        c('.pizzaWindowArea').style.display = 'flex'
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1
        }, 400)

        c('.pizzaInfo--qtmenos').addEventListener('click', () => {

            if(modalQtd > 1) {
                modalQtd--
                c('.pizzaInfo--qt').innerHTML = modalQtd
            
                c('.pizzaInfo--actualPrice').innerHTML = `R$ ${modalQtd * pizzaJson[chave].price.toFixed(2)}`
            }

            
        })
        
        c('.pizzaInfo--qtmais').addEventListener('click', () => {
            modalQtd++
            c('.pizzaInfo--qt').innerHTML = modalQtd
        
            c('.pizzaInfo--actualPrice').innerHTML = `R$ ${modalQtd * pizzaJson[chave].price.toFixed(2)}`
        })
    })

    let pizzaArea = c('.pizza-area')
    pizzaArea.append(pizzaItem)
});

let fecharModal = () => {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500)
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', fecharModal);
})

cs('.pizzaInfo--size').forEach((tamanho) => {
    tamanho.addEventListener('click', () => {
        c('.pizzaInfo--size.selected').classList.remove('selected')
        tamanho.classList.add('selected')
    })
})

c('.pizzaInfo--addButton').addEventListener('click', () => {
    let tamanho = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))

    let identificador = pizzaJson[modalChave].id + '@' + tamanho

    let chave = carrinho.findIndex((item) => {
        return item.identificador == identificador
    })

    if(chave > -1) {
        carrinho[chave].quantidade += modalQtd
    }else {
        carrinho.push({
            identificador,
            id: pizzaJson[modalChave].id,
            tamanho,
            quantidade: modalQtd
        })
    }

    atualizarCarrinho()
    fecharModal()
})


c('.menu-openner').addEventListener('click', () => {
    if(carrinho.length > 0) {
        c('aside').style.left = 0
    }
})

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw'
})

let atualizarCarrinho = () => {
    c('.menu-openner span').innerHTML = carrinho.length


    if(carrinho.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = ''

        let subTotal = 0
        let desconto = 0
        let total = 0

        for(let i in carrinho) {
            
            let pizzaItem = pizzaJson.find((item) => {
                return item.id == carrinho[i].id
            })

            subTotal += pizzaItem.price * carrinho[i].quantidade

            let carrinhoItem = c('.models .cart--item').cloneNode(true)

            let pizzaNomeTamanho

            switch (carrinho[i].tamanho) {
                case 0:
                    pizzaNomeTamanho = 'P'
                    break
                case 1: 
                    pizzaNomeTamanho = 'M'
                    break
                case 2:
                    pizzaNomeTamanho = 'G'
                    break
            }

            let pizzaNome = `${pizzaItem.name} (${pizzaNomeTamanho})`

            
            carrinhoItem.querySelector('img').src = pizzaItem.img
            carrinhoItem.querySelector('.cart--item-nome').innerHTML = pizzaNome
            carrinhoItem.querySelector('.cart--item--qt').innerHTML = carrinho[i].quantidade
            carrinhoItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(carrinho[i].quantidade > 1) {
                    carrinho[i].quantidade--
                }else {
                    carrinho.splice(i, 1)
                }

                atualizarCarrinho()
            })
            carrinhoItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                carrinho[i].quantidade++
                atualizarCarrinho()
            })
            

            
            c('.cart').append(carrinhoItem)
        }

        desconto = subTotal * 0.1
        total = subTotal - desconto

        c('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`


    }else {
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw'
    }
}


