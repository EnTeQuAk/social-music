from flask import Flask, render_template
app = Flask(__name__)
app.config['DEBUG'] = True

@app.route("/", methods=['POST', 'GET'])
def home():
    return render_template('home.html')
