<template>
  <div>
    <header>
      <div class="container">
        <div class="row">
          <div class="col-5">
            <div class="header">
              <ul class="">
                <li>
                  <router-link to="/register">Регистрация</router-link>
                </li>
                <li>
                  <router-link to="/login">Войти</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="row justify-content-end">
          <div class="col-7">
            <div class="header-title">
              <h1><span class="secondary-color">Интерактивная доска</span></h1>
              <h1>для <span class="main-color">творчества</span> и</h1>
              <h1><span class="tertiary-color">самовыражения</span></h1>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="about">
      <div class="container">
        <div class="row justify-content-between margin-bottom-row">
          <div class="col-5 text-center align-self-center">
            <div class="heading">
              Что это такое?
            </div>
          </div>
          <div class="col-1 text-center">
            <div class="vertical-line"></div>
          </div>
          <div class="col-5">
            <div class="section-description">
              Интерактивная доска для творчества - это хранилище для ваших уникальных медиа-файлов. Однако его принцип
              совершенно такой же, как и у обычной магнитной доски. Вы можете загружать свои изображения, аудио,
              текстовые файлы и размещать их в совершенно любом порядке, не имя ограничений в виде всем известной сетки
              или ленты. И это далеко не все возможности!
            </div>
          </div>
        </div>
        <div class="row justify-content-center margin-bottom-row">
          <div class="col-lg-4 col-md-4 text-center align-self-end">
            <div class="activity">
              <div class="activity__image">
                <img src="@/assets/images/headphones.png" alt="Activity-music">
              </div>
              <div class="vertical-line"></div>
              <div class="activity__title">
                Сохраняй музыку
              </div>
              <div class="activity__desc">
                Записываешь песни? Увлекаешься созданием музыки? Помести свои лучшие треки на доску.
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-4 text-center">
            <div class="activity">
              <div class="activity__image">
                <img src="@/assets/images/text.png" alt="Activity-text">
              </div>
              <div class="vertical-line"></div>
              <div class="activity__title">
                Сохраняй текстовые файлы
              </div>
              <div class="activity__desc">
                Пишешь книги? Или стихи? Возможно у тебя есть готовый сценарий для фильма? Сохраняй на доске свои
                готовые произведения.
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-4 text-center align-self-end">
            <div class="activity">
              <div class="activity__image">
                <img src="@/assets/images/camera.png" alt="Activity-image">
              </div>
              <div class="vertical-line"></div>
              <div class="activity__title">
                Сохраняй изображения
              </div>
              <div class="activity__desc">
                Делай коллажи из своих лучших фотографий. Загружай рисунки, картины, скетчи.
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-5"></div>
          <div class="col-1 text-center">
            <div class="line-container">
              <div class="vertical-line"></div>
            </div>
          </div>
          <div class="col-5">
            <div class="heading">
              Хочу какой-то текст
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container-fluid">
        <div class="row p-0">
          <div class="col-3 p-0">
            <div class="image-row image-row-1"></div>
          </div>
          <div class="col-3 p-0">
            <div class="image-row image-row-2"></div>
          </div>
          <div class="col-3 p-0">
            <div class="image-row image-row-3"></div>
          </div>
          <div class="col-3 p-0">
            <div class="image-row image-row-4"></div>
          </div>
        </div>
      </div>
    </section>
    <section class="functions">
      <div class="container">
        <div class="row justify-content-between margin-bottom-row">
          <div class="col-5 text-center align-self-center">
            <div class="heading">
              Чуть подробнее
            </div>
          </div>
          <div class="col-1 text-center">
            <div class="vertical-line"></div>
          </div>
          <div class="col-5">
            <div class="section-description">
              В первую очередь это платформа для творчества совершенно разного направления. Ты можешь компоновать и
              совершенно оригинально оформлять свои творения. Можешь показать свою доску друзьям или оставить её приватной.
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-3">

          </div>
          <div class="col-3"></div>
          <div class="col-3"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'MainPage'
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/partials/main-page";
</style>
