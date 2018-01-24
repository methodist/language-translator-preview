# Language Translation サンプルアプリ 

Watson APIの一つ Language Translationのサンプルアプリです。  
内部で深層学習をつかっているプレビュー版を呼び出しています。  

# 導入手順

## IBM Cloudアカウントの準備

[IBM Cloudアカウントを作る][sign_up] か、あるいは既存のIBM Cloudアカウントを利用します。

## 前提ソフトの導入
次の前提ソフトを導入します。下記のリンク先からダウンロード後、それぞれ導入して下さい。

[gitコマンドラインツール][git]  
[Cloud Foundryコマンドラインツール][cloud_foundry]  
  
注意: Cloud Foundaryのバージョンは最新として下さい。 

## ソースのダウンロード
Githubからアプリケーションのソースをダウンロードします。  
カレントディレクトリのサブディレクトリにソースはダウンロードされるので、あらかじめ適当なサブディレクトリを作り、そこにcdしてから下記のコマンドを実行します。  
ダウンロード後、できたサブディレクトリにcdします。
 

```
$ cd (適当なサブディレクトリ)
$ git clone https://github.com/makaishi2/language-translator-preview.git
$ cd language-translator-preview
```

## CFコマンドでログイン
CFコマンドでIBM Cloud環境にログインします。ログイン名、パスワードはIBMアカウント登録で登録したものを利用します。  
ログインに成功すると、次のような画面となります。  

```
$ cf api https://api.ng.bluemix.net
$ cf login
```

![](readme_images/cf-login.png)  


## CFコマンドの実行
次のような一連のCFコマンドを実行します。
\<service_name\>はなんでもいいのですが、インターネット上のURLの一部となるので、ユニークな名前を指定します。
(例) language-translator-aka2


```
$ cf create-service language_translator lite language-translator-service
$ cf create-service-key language-translator-service myKey
$ cf push <service_name>
```

デプロイには数分時間がかかりますが、正常に終了すれば、アプリケーションの完成です。

## アプリケーションの実行

URLは、

```
https://<service_name>.mybluemix.com
```

です。

[node_js]: https://nodejs.org/ja/download/
[cloud_foundry]: https://github.com/cloudfoundry/cli#downloads
[git]: https://git-scm.com/downloads
[sign_up]: https://bluemix.net/registration
[bluemix_dashboard]: https://console.bluemix.net/dashboard/


