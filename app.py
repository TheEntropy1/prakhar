from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_caching import Cache
import os
import requests
from pytube import YouTube
from youtubesearchpython import VideosSearch
import json
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# Mock database
users = {
    "user1": {"password": "pass1", "premium": True},
    "user2": {"password": "pass2", "premium": False}
}

# Music database mock
with open('static/data/music_db.json') as f:
    music_db = json.load(f)

@app.route('/')
def home():
    return render_template('home.html', featured=music_db['featured'], recent=music_db['recent'])

@app.route('/search')
def search():
    query = request.args.get('q', '')
    return render_template('search.html', query=query, results=search_music(query))

@app.route('/library')
def library():
    return render_template('library.html', playlists=music_db['playlists'])

@app.route('/playlist/<playlist_id>')
def playlist(playlist_id):
    playlist_data = next((p for p in music_db['playlists'] if p['id'] == playlist_id), None)
    return render_template('playlist.html', playlist=playlist_data)

@app.route('/artist/<artist_id>')
def artist(artist_id):
    artist_data = next((a for a in music_db['artists'] if a['id'] == artist_id), None)
    return render_template('artist.html', artist=artist_data)

@app.route('/album/<album_id>')
def album(album_id):
    album_data = next((a for a in music_db['albums'] if a['id'] == album_id), None)
    return render_template('album.html', album=album_data)

@app.route('/stream/<song_id>')
@cache.cached(timeout=3600)
def stream(song_id):
    song = next((s for s in music_db['songs'] if s['id'] == song_id), None)
    if song:
        yt = YouTube(song['url'])
        stream = yt.streams.filter(only_audio=True).first()
        return redirect(stream.url)
    return jsonify({"error": "Song not found"}), 404

@app.route('/api/search')
def api_search():
    query = request.args.get('q', '')
    return jsonify(search_music(query))

def search_music(query):
    results = {
        'songs': [s for s in music_db['songs'] if query.lower() in s['title'].lower()],
        'artists': [a for a in music_db['artists'] if query.lower() in a['name'].lower()],
        'albums': [a for a in music_db['albums'] if query.lower() in a['title'].lower()],
        'playlists': [p for p in music_db['playlists'] if query.lower() in p['title'].lower()]
    }
    return results

if __name__ == '__main__':
    app.run(debug=True)