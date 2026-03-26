import spacy
from collections import Counter
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import textstat
import math

analyzer = SentimentIntensityAnalyzer()

# Load the small English model
nlp = spacy.load("en_core_web_sm")

class TextProcessor:
    def __init__(self, text: str):
        self.text = text
        # This one line runs the entire NLP pipeline (tokenization, tagging, etc.)
        self.doc = nlp(text)

    def get_lexical_stats(self):
        """Extracts basic writing characteristics"""
        word_count = len([token for token in self.doc if not token.is_punct])
        sentence_count = len(list(self.doc.sents))
        avg_word_length = sum(len(token.text) for token in self.doc) / word_count if word_count > 0 else 0
        
        return {
            "word_count": word_count,
            "sentence_count": sentence_count,
            "avg_word_length": round(avg_word_length, 2)
        }

    def get_thematic_keywords(self, top_n=5):
        """Finds the most important 'Noun' keywords for theme extraction"""
        # We filter for Nouns and Proper Nouns, excluding 'stop words' (the, a, is)
        keywords = [
            token.text.lower() 
            for token in self.doc 
            if token.pos_ in ("NOUN", "PROPN") and not token.is_stop and not token.is_punct
        ]
        
        # Count frequencies and return the top N
        most_common = Counter(keywords).most_common(top_n)
        return [item[0] for item in most_common]
    
    def get_sentiment_metrics(self):
        """Calculates emotional consistency and polarity across sentences for long-form reliability"""
        sentence_scores = []
        subjectivity_scores = []
        for sent in self.doc.sents:
            score = analyzer.polarity_scores(sent.text)
            sentence_scores.append(score['compound'])
            subjectivity_scores.append(1.0 - score['neu'])
        
        if not sentence_scores:
            return {
                "polarity_score": 0.0,
                "subjectivity_signal": 0.0,
                "sentiment_variance": 0.0,
                "polarized_sentences": 0,
                "label": "Objective"
            }
            
        avg_score = sum(sentence_scores) / len(sentence_scores)
        avg_subjectivity = sum(subjectivity_scores) / len(subjectivity_scores)
        variance = sum((s - avg_score)**2 for s in sentence_scores) / len(sentence_scores)
        polarized_count = len([s for s in sentence_scores if abs(s) > 0.5])
        
        return {
            "polarity_score": round(avg_score, 4),
            "subjectivity_signal": round(avg_subjectivity, 4),
            "sentiment_variance": round(variance, 4),
            "polarized_sentences": polarized_count,
            "label": "Objective" if abs(avg_score) < 0.1 else "Perspective-driven"
        }

    def get_readability_metrics(self):
        """Measures complexity and vocabulary range"""
        # 1. Flesch Reading Ease: 0-100 (Higher is easier)
        # Academic papers usually score 0-30 (Very Difficult)
        readability = textstat.flesch_reading_ease(self.text)
        
        # 2. Lexical Diversity (Unique words / Total words)
        words = [t.text.lower() for t in self.doc if not t.is_punct]
        unique_words = set(words)
        diversity_score = len(unique_words) / len(words) if len(words) > 0 else 0
        
        return {
            "reading_ease": readability,
            "grade_level": textstat.flesch_kincaid_grade(self.text),
            "lexical_diversity": round(diversity_score, 2),
            "label": "Complex" if readability < 40 else "Accessible"
        }

    def get_ai_signal(self):
        """Calculates Predictability based on word-level Shannon Entropy and Burstiness"""
        # 1. Word-level Entropy (Unigrams)
        words = [token.text.lower() for token in self.doc if not token.is_punct and not token.is_space]
        if not words:
            return {"predictability_score": 0, "burstiness": 0, "label": "N/A"}
            
        word_counts = Counter(words)
        total_words = len(words)
        prob = [count/total_words for count in word_counts.values()]
        entropy = -sum(p * math.log2(p) for p in prob)
        
        # 2. Burstiness (Sentence length variation)
        sentences = list(self.doc.sents)
        lengths = [len(s) for s in sentences]
        if len(lengths) > 1:
            variance = sum((x - (sum(lengths)/len(lengths)))**2 for x in lengths) / len(lengths)
        else:
            variance = 0
            
        return {
            "predictability_score": round(entropy, 2), 
            "burstiness": round(math.sqrt(variance), 2),
            "label": "Highly Structured" if entropy < 4.5 else "Variable"
        }